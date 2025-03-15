#!/bin/bash
VITE_CJS_IGNORE_WARNING=true
cd src/modules || exit

for d in */ ; do
  if [ -f "$d/package.json" ] && [ -f "$d/vite.config.mjs" ]; then
    echo "Building $d in $ENV mode..."
    (cd "$d" && npm run build)
  else
    echo "Skipping $d (No package.json or vite.config.mjs found)"
  fi
done

echo "All modules built!"
