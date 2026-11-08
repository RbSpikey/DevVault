import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';

import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CirclePlay,
  Code2,
  Copy,
  ExternalLink,
  BookOpen,
  Menu,
  Package,
  Search,
  Zap
} from 'lucide-react';

import hljs from 'highlight.js/lib/core';
import lua from 'highlight.js/lib/languages/lua';
import JSZip from 'jszip';

import { getProject, projects } from './services/projects.js';

hljs.registerLanguage('lua', lua);

const youtube = 'https://www.youtube.com/@RBSpikey';

function Brand({ small = false }) {
  return (
    <Link to="/" className={`brand ${small ? 'brand-small' : ''}`}>
      <span className="brand-mark">
        R<span>.</span>
      </span>
      <span>
        RB<span className="brand-accent">SPIKEY</span>
      </span>
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav-wrap">
      <nav className="nav container">
        <Brand />

        <button
          className="mobile-menu"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <Menu size={20} />
        </button>

        <div className={`nav-links ${open ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/Projects" onClick={() => setOpen(false)}>
            Projects
          </NavLink>

          <a
            href={youtube}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            YouTube <ExternalLink size={13} />
          </a>
        </div>

        <a className="nav-cta" href={youtube} target="_blank" rel="noopener noreferrer">
          Watch on YouTube <ArrowRight size={15} />
        </a>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <Brand small />
          <p>Making Roblox development a little simpler.</p>
        </div>

        <div className="footer-links">
          <Link to="/Projects">Project library</Link>

          <a href={youtube} target="_blank" rel="noopener noreferrer">
            YouTube <ExternalLink size={13} />
          </a>
        </div>

        <span className="copyright">© {new Date().getFullYear()} RBSpikey</span>
      </div>
    </footer>
  );
}

function Shell({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-dot" />
      {children}
    </div>
  );
}

function Home() {
  return (
    <Shell>
      <section className="hero container">
        <div className="hero-copy">
          <SectionLabel>ROBLOX DEVELOPER RESOURCE HUB</SectionLabel>

          <h1>
            Roblox Development,
            <br />
            <span>Simplified.</span>
          </h1>

          <p className="hero-desc">
            Useful systems, ready-to-use scripts, and practical resources to help you
            build better experiences in Roblox Studio.
          </p>

          <div className="hero-actions">
            <Link to="/Projects" className="button button-primary">
              Explore Projects <ArrowRight size={17} />
            </Link>

            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-quiet"
            >
              <CirclePlay size={17} /> Visit YouTube
            </a>
          </div>

          <div className="hero-meta">
            <div className="avatar-stack">
              <span>R</span>
              <span>Lu</span>
              <span>▶</span>
            </div>

            <span>
              <b>{projects.length} resources</b> and growing
            </span>

            <i />
          </div>
        </div>

        <div className="hero-art">
          <div className="art-glow" />

          <div className="art-card art-back">
            <div className="art-top">
              <span className="traffic">
                <i />
                <i />
                <i />
              </span>
              <span>ModuleScript</span>
            </div>

            <pre>
              <code>
                <span className="code-pink">local</span> Players = game:
                <span className="code-blue">GetService</span>(
                <span className="code-green">"Players"</span>){'\n'}
                <span className="code-pink">local</span> player = Players.LocalPlayer
                {'\n\n'}
                <span className="code-muted">-- build something great</span>
                {'\n'}
                <span className="code-blue">print</span>(
                <span className="code-green">"Let's play!"</span>)
              </code>
            </pre>
          </div>

          <div className="float-chip chip-one">
            <span className="chip-icon orange">
              <Zap size={15} />
            </span>

            <div>
              <b>Ready to use</b>
              <small>Drop in. Build on.</small>
            </div>

            <Check size={15} className="chip-check" />
          </div>

          <div className="float-chip chip-two">
            <span className="chip-icon purple">
              <Code2 size={15} />
            </span>

            <div>
              <b>Luau powered</b>
              <small>Made for Studio</small>
            </div>
          </div>

          <div className="art-tag">
            <span className="pulse" /> BUILT FOR CREATORS
          </div>
        </div>
      </section>

      <section className="featured-section container">
        <div className="featured-heading">
          <div>
            <SectionLabel>PROJECT LIBRARY</SectionLabel>
            <h2>
              Start with a <span>project.</span>
            </h2>
            <p>
              Free Roblox systems with the code and setup notes to make them your own.
            </p>
          </div>
          <Link to="/Projects" className="featured-link">
            View all projects <ArrowRight size={16} />
          </Link>
        </div>

        <div className="project-grid">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </Shell>
  );
}

function ProjectCard({ project }) {
  return (
    <Link to={`/Projects/${project.id}`} className="project-card">
      <div className="project-image">
        <img
          src={project.thumbnail}
          alt={`${project.name} project artwork`}
          onError={(e) => {
            e.currentTarget.src = `${import.meta.env.BASE_URL}images/fallback.svg`;
          }}
        />

        <span className="image-arrow">
          <ArrowRight size={17} />
        </span>
      </div>

      <div className="project-card-body">
        <div className="card-kicker">
          <span>{project.category}</span>
          <span className="version">v{project.version || '1.0'}</span>
        </div>

        <h3>{project.name}</h3>
        <p>{project.description}</p>

        <div className="tag-row">
          {project.tags.slice(0, 3).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function ProjectsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...new Set(projects.map((p) => p.category))],
    []
  );

  const filtered = projects.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      `${p.name} ${p.description} ${p.tags.join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  return (
    <Shell>
      <section className="page-intro container">
        <div>
          <SectionLabel>THE RESOURCE LIBRARY</SectionLabel>

          <h1>
            Projects & <span>systems.</span>
          </h1>

          <p>
            Useful building blocks for your next Roblox experience. Explore, learn, and
            make them your own.
          </p>
        </div>

        <div className="library-count">
          <strong>{String(projects.length).padStart(2, '0')}</strong>
          <span>
            RESOURCES
            <br />
            AND COUNTING
          </span>
        </div>
      </section>

      <section className="library container">
        <div className="library-toolbar">
          <label className="search-box">
            <Search size={18} />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              aria-label="Search projects"
            />

            <kbd>⌘ K</kbd>
          </label>

          <div className="category-list" aria-label="Filter by category">
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? 'selected' : ''}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length ? (
          <div className="project-grid">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">
              <Search />
            </span>

            <h3>No projects found</h3>
            <p>Try a different search or clear your category filter.</p>

            <button
              className="button button-quiet"
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="library-note">
          <span className="live-dot" />
          Showing {filtered.length} of {projects.length} resources
          <span className="note-divider" />
          New projects are added regularly
        </div>
      </section>
    </Shell>
  );
}

function ScriptCode({ script }) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(script.content);
      setCopied(true);
      setToast('Copied to clipboard');

      setTimeout(() => setCopied(false), 1800);
      setTimeout(() => setToast(''), 2200);
    } catch {
      setToast('Clipboard access unavailable');
      setTimeout(() => setToast(''), 2200);
    }
  };

  const download = () => {
    if (!script.content) return;

    const blob = new Blob([script.content], {
      type: 'text/plain;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = script.name;
    a.click();

    URL.revokeObjectURL(url);
  };

  const lines = (script.content || '').split('\n');

  return (
    <div className="script-content">
      <div className="code-actions script-actions">
        <button
          onClick={copy}
          className={copied ? 'is-copied' : ''}
          disabled={script.missing}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? 'Copied' : 'Copy code'}</span>
        </button>

        <button onClick={download} disabled={script.missing}>
          <ArrowDownToLine size={15} />
          <span>Download .lua</span>
        </button>
      </div>

      {script.missing ? (
        <div className="code-missing">
          This script file could not be found. Check the project's scripts folder.
        </div>
      ) : (
        <div className="code-scroll">
          <div className="code-lines">
            {lines.map((line, i) => {
              let html;

              try {
                html = line ? hljs.highlight(line, { language: 'lua' }).value : '&nbsp;';
              } catch {
                html = line.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
              }

              return (
                <div className="code-line" key={i}>
                  <span className="line-no">{String(i + 1).padStart(2, '0')}</span>

                  <code dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <Check size={15} />
          {toast}
        </div>
      )}
    </div>
  );
}

function CodeViewer({ project }) {
  if (project.scripts.length === 1) {
    return <ScriptCode script={project.scripts[0]} />;
  }

  return (
    <div className="script-accordion-list">
      {project.scripts.map((script, index) => (
        <details className="script-accordion" key={script.path}>
          <summary>
            <span className="accordion-file-icon">
              <Code2 size={16} />
            </span>

            <span className="accordion-file-info">
              <b>{script.name}</b>
              <small>{script.description || 'Luau source file'}</small>
            </span>

            <span className="accordion-file-number">
              FILE {String(index + 1).padStart(2, '0')}
            </span>

            <ChevronDown size={16} className="accordion-chevron" />
          </summary>

          <ScriptCode script={script} />
        </details>
      ))}
    </div>
  );
}

function ProjectDetail() {
  const { id } = useParams();
  const project = getProject(id);

  if (!project) {
    return (
      <Shell>
        <div className="not-found container">
          <div className="not-found-code">404</div>
          <h1>Project not found.</h1>
          <p>This resource may have moved or the URL may be incorrect.</p>

          <Link className="button button-primary" to="/Projects">
            <ArrowLeft size={16} /> Back to projects
          </Link>
        </div>
      </Shell>
    );
  }

  const downloadAll = async () => {
    const zip = new JSZip();

    for (const s of project.scripts) {
      if (s.content) {
        zip.file(s.path, s.content);
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${project.id}-scripts.zip`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Shell>
      <div className="project-detail container">
        <Link to="/Projects" className="back-link">
          <ArrowLeft size={15} /> All projects
        </Link>

        <section className="project-detail-hero">
          <div className="detail-copy">
            <div className="card-kicker">
              <span>{project.category}</span>
              <span className="version">v{project.version || '1.0'}</span>
            </div>

            <h1>{project.name}</h1>
            <p>{project.description}</p>

            {project.explanation?.enabled && project.explanation.sections?.length > 0 && (
              <Link
                className="button button-primary explain-link"
                to={`/Projects/${project.id}/explain`}
              >
                <BookOpen size={16} /> Explain this script <ArrowRight size={15} />
              </Link>
            )}

            {project.videoUrl && /^https?:\/\//i.test(project.videoUrl) && (
              <a
                className="project-video-link"
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CirclePlay size={16} />
                Watch project video
                <ExternalLink size={13} />
              </a>
            )}

            <div className="tag-row">
              {project.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>

            <div className="detail-facts">
              <span>
                <Code2 size={15} />
                {project.scripts.length}{' '}
                {project.scripts.length === 1 ? 'script' : 'scripts'}
              </span>

              <span>
                <Package size={15} />
                Luau
              </span>
            </div>
          </div>

          <img
            className="detail-thumb"
            src={project.thumbnail || `${import.meta.env.BASE_URL}images/fallback.svg`}
            onError={(e) => {
              e.currentTarget.src = `${import.meta.env.BASE_URL}images/fallback.svg`;
            }}
            alt={`${project.name} artwork`}
          />
        </section>

        <div className="detail-columns">
          <section className="main-column">
            <div className="content-section">
              <div className="content-title">
                <div>
                  <SectionLabel>THE OVERVIEW</SectionLabel>
                  <h2>About this project</h2>
                </div>
              </div>

              <p className="prose">{project.details || project.description}</p>

              {project.features?.length > 0 && (
                <div className="feature-list">
                  {project.features.map((f) => (
                    <span key={f}>
                      <Check size={15} />
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="content-section code-section">
              <div className="content-title code-title">
                <div>
                  <SectionLabel>SOURCE CODE</SectionLabel>
                  <h2>
                    Scripts <span>included.</span>
                  </h2>
                </div>

                {project.scripts.length > 1 && (
                  <button onClick={downloadAll} className="button button-outline">
                    <Package size={15} />
                    Download all
                    <ArrowDownToLine size={15} />
                  </button>
                )}
              </div>

              {project.scripts.length > 1 && (
                <div className="script-list-hint">
                  <span>{project.scripts.length} FILES</span> — open a file to view its
                  code
                </div>
              )}

              {project.scripts.length ? (
                <CodeViewer project={project} />
              ) : (
                <div className="empty-state">
                  No scripts are configured for this project.
                </div>
              )}
            </div>
          </section>

          <aside className="side-column">
            <div className="side-card">
              <SectionLabel>GETTING STARTED</SectionLabel>
              <h3>Installation</h3>

              {project.instructions?.length ? (
                <ol className="steps">
                  {project.instructions.map((step, i) => (
                    <li key={i}>
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="side-muted">No installation guide has been added yet.</p>
              )}

              {project.notes && (
                <div className="note-box">
                  <span>NOTE</span>
                  <p>{project.notes}</p>
                </div>
              )}
            </div>

            <div className="side-card meta-card">
              <SectionLabel>PROJECT DETAILS</SectionLabel>

              <div>
                <span>Category</span>
                <b>{project.category}</b>
              </div>

              <div>
                <span>Version</span>
                <b>{project.version || '—'}</b>
              </div>

              <div>
                <span>File format</span>
                <b>.lua / .luau</b>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

function ExplainPage() {
  const { id } = useParams();
  const project = getProject(id);
  const explanation = project?.explanation;
  const sections = explanation?.sections || [];
  const [sectionIndex, setSectionIndex] = useState(0);

  useEffect(() => {
    setSectionIndex(0);
  }, [id]);

  if (!project || !explanation?.enabled || !sections.length) {
    return (
      <Shell>
        <div className="not-found container">
          <div className="not-found-code">404</div>
          <h1>Explanation not found.</h1>
          <p>This project does not have an explanation available yet.</p>
          <Link
            className="button button-primary"
            to={project ? `/Projects/${project.id}` : '/Projects'}
          >
            <ArrowLeft size={16} /> {project ? 'Back to project' : 'Back to projects'}
          </Link>
        </div>
      </Shell>
    );
  }

  const section = sections[sectionIndex];
  const progress = ((sectionIndex + 1) / sections.length) * 100;
  const highlightedLines = section.code.split('\n');

  return (
    <Shell>
      <div className="explain-page container">
        <Link to={`/Projects/${project.id}`} className="back-link">
          <ArrowLeft size={15} /> Back to {project.name}
        </Link>

        <header className="explain-header">
          <SectionLabel>GUIDED CODE WALKTHROUGH</SectionLabel>
          <h1>
            {project.name}: <span>{explanation.title || 'How it works'}</span>
          </h1>
          <p>{explanation.intro || project.description}</p>
        </header>

        <section className="explain-card" aria-live="polite">
          <div className="explain-progress-row">
            <span>
              SECTION {String(sectionIndex + 1).padStart(2, '0')} <i>OF</i>{' '}
              {String(sections.length).padStart(2, '0')}
            </span>
            <span>{Math.round(progress)}% COMPLETE</span>
          </div>
          <div
            className="explain-progress-track"
            role="progressbar"
            aria-label="Explanation progress"
            aria-valuemin={1}
            aria-valuemax={sections.length}
            aria-valuenow={sectionIndex + 1}
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="explain-section-heading">
            <span>{String(sectionIndex + 1).padStart(2, '0')}</span>
            <h2>{section.title}</h2>
          </div>

          <div className="explain-code" aria-label="Lua code example">
            <div className="explain-code-top">
              <Code2 size={15} /> SOURCE FROM{' '}
              {project.scripts.find((script) => script.content?.includes(section.code))
                ?.name || 'PROJECT SCRIPT'}{' '}
              <span>LUAU</span>
            </div>
            <div className="code-scroll">
              <div className="code-lines">
                {highlightedLines.map((line, lineIndex) => {
                  let html;
                  try {
                    html = line
                      ? hljs.highlight(line, { language: 'lua' }).value
                      : '&nbsp;';
                  } catch {
                    html = line.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
                  }
                  return (
                    <div className="code-line" key={lineIndex}>
                      <span className="line-no">
                        {String(lineIndex + 1).padStart(2, '0')}
                      </span>
                      <code dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="explain-description">
            <h3>What this part does</h3>
            <p>{section.description}</p>
            {section.note && (
              <aside className="note-box">
                <span>TIP</span>
                <p>{section.note}</p>
              </aside>
            )}
          </div>

          <div className="explain-navigation">
            <button
              className="button button-outline"
              onClick={() => setSectionIndex((current) => current - 1)}
              disabled={sectionIndex === 0}
            >
              <ArrowLeft size={15} /> Previous
            </button>
            <span>
              {sectionIndex + 1} / {sections.length}
            </span>
            {sectionIndex === sections.length - 1 ? (
              <Link className="button button-primary" to={`/Projects/${project.id}`}>
                Return to project <ArrowRight size={15} />
              </Link>
            ) : (
              <button
                className="button button-primary"
                onClick={() => setSectionIndex((current) => current + 1)}
              >
                Next section <ArrowRight size={15} />
              </button>
            )}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function NotFound() {
  return (
    <Shell>
      <div className="not-found container">
        <div className="not-found-code">404</div>
        <h1>Page not found.</h1>

        <Link className="button button-primary" to="/">
          <ArrowLeft size={16} /> Back home
        </Link>
      </div>
    </Shell>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Projects" element={<ProjectsPage />} />
        <Route path="/Projects/:id/explain" element={<ExplainPage />} />
        <Route path="/Projects/:id" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
