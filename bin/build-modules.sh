#!/bin/bash
VITE_CJS_IGNORE_WARNING=true
cd src/modules || exit

# Rollup yapılandırma dosyasının projenin kök dizinindeki yolu
# ROLLOUT_CONFIG_PATH="../../../rollup.config.js"  # Kök dizine göre doğru yolu belirtin

# Modül dizininde gezin ve her modül için Rollup'u çalıştır
for d in */ ; do
  if [ -f "$d/package.json" ]; then
    echo "Building $d..."
    # Modülün doğru dizine gidip gitmediğini kontrol et
    echo "Module directory: $d"
    (cd "$d" && npm install)
  else
    echo "Skipping $d (No package.json found)"
  fi
done
