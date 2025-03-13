#!/bin/bash
VITE_CJS_IGNORE_WARNING=true
cd src/modules || exit

for d in */ ; do
  if [ -f "$d/package.json" ]; then
    echo "Building $d..."
    (cd "$d" && npm run build)
  else
    echo "Skipping $d (No package.json found)"
  fi
done
