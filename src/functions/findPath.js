function dfs(target, prevKey, obj, callback, path='') {
  // Record the current path we've traversed to.
  if (prevKey !== '') path += (path ? '_': '') + prevKey.toUpperCase();
  // If we've found a target path call the callback
  if ((path === target) || path.endsWith('_' + target)) {
    callback(path)
  } else {
    // Traverse further through the object.
    if (typeof obj !== 'object' || Array.isArray(obj)) return;
    for (let key of Object.keys(obj)) {
      dfs(target, key, obj[key], callback, path)
    }
  }
}

function findPath(path, obj) {
  // Recieve a short text path and return an array of the target path.
  if (path === undefined) return [];
  let paths = [];
  dfs(path, '', obj, (p) => paths.push(p))
  return paths;
}

module.exports = findPath;