#!/usr/bin/env python3
"""Best-effort archive of public Instagram photos for review (no login/bypass)."""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import instaloader


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--username", default="ramadabywyndhamnigde")
    parser.add_argument("--max-posts", type=int, default=12)
    parser.add_argument("--output", type=Path, default=Path("instagram-output"))
    args = parser.parse_args()

    if not re.fullmatch(r"[A-Za-z0-9._]{1,30}", args.username):
        parser.error("Invalid Instagram username")
    if not 1 <= args.max_posts <= 30:
        parser.error("--max-posts must be 1..30")

    root = args.output.resolve()
    folder = root / args.username
    folder.mkdir(parents=True, exist_ok=True)
    loader = instaloader.Instaloader(
        dirname_pattern=str(root / "{target}"),
        filename_pattern="{date_utc}_UTC_{shortcode}",
        download_pictures=True,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        post_metadata_txt_pattern="",
        max_connection_attempts=1,
    )

    record = {
        "username": args.username,
        "profile_url": f"https://www.instagram.com/{args.username}/",
        "checked_at_utc": datetime.now(timezone.utc).isoformat(),
        "max_posts": args.max_posts,
        "posts": [],
    }
    error = None
    try:
        profile = instaloader.Profile.from_username(loader.context, args.username)
        if profile.is_private:
            raise RuntimeError("Profile is private; this workflow only fetches public media")
        for index, post in enumerate(profile.get_posts()):
            if index >= args.max_posts:
                break
            # Video-only posts are intentionally skipped; photo carousels are kept.
            if post.typename == "GraphVideo":
                continue
            print(f"Reviewing https://www.instagram.com/p/{post.shortcode}/", flush=True)
            loader.download_post(post, target=args.username)
            images = sorted(
                item.name
                for item in folder.glob(f"*{post.shortcode}*")
                if item.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
            )
            if images:
                record["posts"].append(
                    {
                        "url": f"https://www.instagram.com/p/{post.shortcode}/",
                        "date_utc": post.date_utc.isoformat() + "Z",
                        "images": images,
                    }
                )
    except Exception as exc:
        # Show the actual API/login/rate-limit problem in Actions logs.
        error = f"{type(exc).__name__}: {exc}"
        record["error"] = error

    record["image_count"] = sum(len(post["images"]) for post in record["posts"])
    (root / "manifest.json").write_text(
        json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Collected {record['image_count']} images from {len(record['posts'])} posts.")
    if error:
        print(f"Instagram access failed: {error}", file=sys.stderr)
        return 1
    if not record["image_count"]:
        print("No photos were accessible; Instagram may require login or block requests.", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
