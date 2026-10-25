#!/usr/bin/env bash
# usage: run.sh <case> <with|without> <rep> <outroot> <repo>
set -u
case_=$1; arm=$2; rep=$3; name=$1-$2-$3; out=$4/$name; repo=$5
rm -rf "$out"; mkdir -p "$out"
[ -d "$repo/evals/$case_/files" ] && cp "$repo/evals/$case_/files/"* "$out/"
extra=()
[ "$arm" = with ] && extra=(--plugin-dir "$repo")
cd "$out"
claude -p "$(cat "$repo/evals/$case_/prompt.md")" --model sonnet --setting-sources project \
  --permission-mode acceptEdits --allowedTools "Read,Write,Edit,Glob,Grep,Skill" \
  --output-format stream-json --verbose "${extra[@]}" < /dev/null > ../$name.jsonl 2> ../$name.err
echo "$name exit $? skill=$(grep -c '"name":"Skill"' ../$name.jsonl) refs=$(grep -o 'references/[a-z-]*\.md' ../$name.jsonl | sort -u | tr '\n' ' ')"
