const configs = import.meta.glob('../../projects/*/project.json', { eager: true, import: 'default' });
const sourceFiles = import.meta.glob('../../projects/*/scripts/*', { eager: true, query: '?raw', import: 'default' });

const safeSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const registry = new Map();
const issues = [];

for (const [configPath, config] of Object.entries(configs)) {
  const folder = configPath.split('/').at(-2);
  try {
    if (!config || typeof config !== 'object') throw new Error('Configuration must be a JSON object.');
    if (!safeSlug.test(config.id || '') || config.id !== folder) throw new Error('Project id must be a valid slug matching its folder.');
    if (registry.has(config.id)) throw new Error(`Duplicate project id: ${config.id}`);
    if (!config.name || !Array.isArray(config.scripts)) throw new Error('Project requires a name and scripts array.');
    const scripts = config.scripts.map((script) => {
      const rel = String(script.path || '');
      if (!/^scripts\/[A-Za-z0-9_.-]+\.lua$/.test(rel)) throw new Error(`Unsafe script path: ${rel}`);
      const sourceKey = Object.keys(sourceFiles).find((key) => key.endsWith(`/projects/${folder}/${rel}`));
      return { ...script, content: sourceKey ? sourceFiles[sourceKey] : null, missing: !sourceKey };
    });
    const project = {
      ...config,
      description: config.description || 'A Roblox development resource from RBSpikey.',
      thumbnail: config.thumbnail ? `${import.meta.env.BASE_URL}${config.thumbnail.replace(/^\//, '')}` : undefined,
      category: config.category || 'Resources', tags: Array.isArray(config.tags) ? config.tags : [],
      scripts, missingThumbnail: !config.thumbnail,
    };
    if (scripts.some((s) => s.missing)) issues.push(`${config.id}: one or more scripts are missing.`);
    registry.set(config.id, project);
  } catch (error) { issues.push(`${folder}: ${error.message}`); }
}

export const projects = [...registry.values()].sort((a, b) => a.name.localeCompare(b.name));
export const projectIssues = issues;
export const getProject = (id) => registry.get(id);
