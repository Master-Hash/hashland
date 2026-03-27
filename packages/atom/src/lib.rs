use atom_syndication::{Entry, Feed, Generator, Link, Person, Text};
use napi::bindgen_prelude::*;
use napi_derive::napi;
use std::collections::HashSet;
use std::ops::ControlFlow;
use std::sync::{LazyLock, Mutex};

// 查找最近一个含有 pnpm-workspace.yaml 的上级目录
// POST_PATH 在该目录的 land/post 下
static POST_PATH: LazyLock<String> = LazyLock::new(|| {
    let mut path = std::env::current_dir().unwrap();
    loop {
        if path.join("pnpm-workspace.yaml").exists() {
            return path.join("land/post").to_str().unwrap().to_string();
        }
        if !path.pop() {
            panic!("pnpm-workspace.yaml not found in any parent directory");
        }
    }
});
static SITEURL: &str = "https://land.hash.moe/";
// todo: https://github.com/rust-lang/rust/issues/143874
// it should be a slice eventually
static SITE: &str = "land.hash.moe";

#[napi(object)]
#[derive(Clone)]
pub struct PostItem {
    pub title: String,
    pub description: String,
    pub url: String,
    pub change_type: String,
    pub commit_time: String,
    pub commit_id: String,
}

#[napi]
pub fn generate_rss() -> Result<Uint8Array> {
    let items = build_posts()?;
    let s = build_atom_xml(&items);
    Ok(Uint8Array::from(s.as_bytes()))
}

#[napi]
pub fn collect_posts() -> Result<Vec<PostItem>> {
    build_posts()
}

struct ChangedFile {
    path: String,
    change_type: String,
}

static POSTS_CACHE: LazyLock<Mutex<Option<Vec<PostItem>>>> = LazyLock::new(|| Mutex::new(None));

fn build_posts() -> Result<Vec<PostItem>> {
    if let Some(cached) = POSTS_CACHE
        .lock()
        .map_err(|e| Error::from_reason(format!("failed to lock posts cache: {e}")))?
        .clone()
    {
        return Ok(cached);
    }

    let repo = gix::open(POST_PATH.to_string()).unwrap();

    let head_id = repo.head_id().unwrap();

    let mut seen_titles: HashSet<String> = HashSet::new();
    let mut items = Vec::new();

    for info in head_id
        .ancestors()
        .all()
        .map_err(|e| Error::from_reason(format!("failed to walk history: {e}")))?
    {
        let info = info.unwrap();
        let commit = info.id().object().unwrap().into_commit();

        let message = commit.message_raw().unwrap().to_string();

        let Some((title, description)) = parse_commit_message(&message) else {
            continue;
        };
        if seen_titles.contains(&title) {
            continue;
        }

        let commit_id = info.id().to_string();
        let changed_files = changed_files_from_commit(&repo, &commit)?;
        if changed_files.is_empty() {
            eprintln!("commit {commit_id} has no changed files; skipped");
            continue;
        }
        if changed_files.len() > 1 {
            eprintln!(
                "commit {commit_id} changed {} files, using first: {}",
                changed_files.len(),
                changed_files[0].path
            );
        }

        let file_path = changed_files[0].path.replace('\\', "/");
        let url = file_path.to_string();
        let change_type = changed_files[0].change_type.clone();
        let commit_time = commit_time_iso(&commit);

        seen_titles.insert(title.clone());
        items.push(PostItem {
            title,
            description,
            url,
            change_type,
            commit_time,
            commit_id,
        });

        if items.len() >= 5 {
            break;
        }
    }

    {
        let mut cache = POSTS_CACHE
            .lock()
            .map_err(|e| Error::from_reason(format!("failed to lock posts cache: {e}")))?;
        *cache = Some(items.clone());
    }

    Ok(items)
}

fn parse_commit_message(message: &str) -> Option<(String, String)> {
    let subject = message.lines().next()?.trim();

    // Breaking change commits are ignored by requirement.
    if subject.contains('!') || subject.contains("breaking") {
        return None;
    }
    // No structural posts.
    if subject.contains("(now)") {
        return None;
    }
    if !subject.starts_with("feat(") {
        return None;
    }

    let sep = subject.find("):")?;
    let title = subject[5..sep].trim();
    let description = subject[(sep + 2)..].trim();

    if title.is_empty() || description.is_empty() {
        return None;
    }

    Some((title.to_owned(), description.to_owned()))
}

fn changed_files_from_commit(
    repo: &gix::Repository,
    commit: &gix::Commit<'_>,
) -> Result<Vec<ChangedFile>> {
    let previous_tree = match commit.parent_ids().next() {
        Some(parent_id) => parent_id
            .object()
            .map_err(|e| Error::from_reason(format!("failed to load parent commit object: {e}")))?
            .into_commit()
            .tree()
            .map_err(|e| Error::from_reason(format!("failed to load parent tree: {e}")))?,
        None => repo.empty_tree(),
    };
    let current_tree = commit
        .tree()
        .map_err(|e| Error::from_reason(format!("failed to load commit tree: {e}")))?;

    let mut changed_files = Vec::<ChangedFile>::new();
    previous_tree
        .changes()
        .map_err(|e| Error::from_reason(format!("failed to initialize tree diff: {e}")))?
        .for_each_to_obtain_tree(&current_tree, |change| {
            use gix::object::tree::diff::Change;

            let (location, entry_mode, change_type) = match change {
                Change::Addition {
                    location,
                    entry_mode,
                    ..
                } => (location, entry_mode, "add"),
                Change::Deletion {
                    location,
                    entry_mode,
                    ..
                } => (location, entry_mode, "delete"),
                Change::Modification {
                    location,
                    entry_mode,
                    ..
                } => (location, entry_mode, "modify"),
                Change::Rewrite {
                    location,
                    entry_mode,
                    ..
                } => (location, entry_mode, "other"),
            };

            if !entry_mode.is_tree() {
                changed_files.push(ChangedFile {
                    path: String::from_utf8_lossy(location.as_ref()).into_owned(),
                    change_type: change_type.to_string(),
                });
            }

            Ok::<_, std::convert::Infallible>(ControlFlow::Continue(()))
        })
        .map_err(|e| {
            Error::from_reason(format!(
                "failed to collect changed files from tree diff: {e}"
            ))
        })?;

    Ok(changed_files
        .into_iter()
        .filter(|changed| !changed.path.is_empty())
        .collect())
}

fn commit_time_iso(commit: &gix::Commit<'_>) -> String {
    let time = commit.time().unwrap();
    time.format(gix::date::time::format::ISO8601_STRICT)
        .unwrap()
}

fn build_atom_xml(items: &[PostItem]) -> String {
    let mut feed = Feed {
        title: Text::plain(format!("故人故事故纸堆（{}）", SITE)),
        id: SITEURL.to_string(),
        links: vec![
            Link {
                href: format!("{SITEURL}atom.xml"),
                rel: "self".to_string(),
                ..Default::default()
            },
            Link {
                href: SITEURL.to_string(),
                rel: "alternate".to_string(),
                ..Default::default()
            },
        ],
        authors: vec![Person {
            name: "hash".to_string(),
            ..Default::default()
        }],
        generator: Some(Generator {
            value: "rust-syndication/atom".to_string(),
            uri: Some("https://github.com/rust-syndication/atom".to_string()),
            ..Default::default()
        }),
        ..Default::default()
    };

    for item in items {
        let updated = item.commit_time.parse().unwrap();

        let entry = Entry {
            title: Text::plain(item.title.clone()),
            id: item.commit_id.clone(),
            updated,
            published: None,
            summary: Some(Text::plain(item.description.clone())),
            links: vec![Link {
                href: format!("{}{}", SITEURL, item.url),
                ..Default::default()
            }],
            ..Default::default()
        };

        feed.entries.push(entry);
    }

    if let Some(first) = feed.entries.first() {
        feed.updated = first.updated;
    }

    feed.to_string()
}
