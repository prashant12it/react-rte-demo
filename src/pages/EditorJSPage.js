import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Import EditorJS and tools from npm packages
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';

/**
 * Editor.js Page Component
 * Integrates Editor.js with comprehensive toolbar and submit functionality
 */
const EditorJSPage = () => {
  const [content, setContent] = useState(null);
  const [submittedContent, setSubmittedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const editorInstance = useRef(null);
  const isInitialized = useRef(false);

  // Callback ref that will be called when the DOM element is available
  const editorContainerRef = useCallback((node) => {
    if (node && !isInitialized.current) {
      console.log('Container ref set, initializing editor...');
      initEditorJS(node);
    }
  }, []);

  // Initialize Editor.js when container becomes available
  const initEditorJS = async (containerElement) => {
    // Prevent multiple initializations
    if (isInitialized.current) {
      console.log('Editor already initialized, skipping...');
      return;
    }

    try {
      // Mark as initialized to prevent multiple calls
      isInitialized.current = true;

      // Destroy existing instance if any
      if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
        try {
          await editorInstance.current.destroy();
        } catch (destroyError) {
          console.warn('Error destroying editor:', destroyError);
        }
        editorInstance.current = null;
      }

      // Clear the container before creating new editor
      containerElement.innerHTML = '';
      console.log('Container found and cleared, initializing editor...');

      const editor = new EditorJS({
        holder: containerElement, // Use the container element directly
          placeholder: 'Click here to start writing your content...',
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: 'Enter a header',
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2
              },
              shortcut: 'CMD+SHIFT+H'
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
              config: {
                placeholder: 'Start typing...'
              }
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered'
              },
              shortcut: 'CMD+SHIFT+L'
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              shortcut: 'CMD+SHIFT+O',
              config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote\'s author',
              },
            }
          },
          data: {
            blocks: [
              {
                type: 'header',
                data: {
                  text: 'Welcome to Editor.js!',
                  level: 2
                }
              },
              {
                type: 'paragraph',
                data: {
                  text: 'Start typing your content here. You can:'
                }
              },
              {
                type: 'list',
                data: {
                  style: 'unordered',
                  items: [
                    'Add headers (H1-H6)',
                    'Create paragraphs with rich text',
                    'Make ordered and unordered lists',
                    'Insert quotes with citations',
                    'Use keyboard shortcuts'
                  ]
                }
              },
              {
                type: 'quote',
                data: {
                  text: 'Editor.js is a block-styled editor with clean JSON output.',
                  caption: 'EditorJS Team'
                }
              }
            ]
          },
          onChange: async (api, event) => {
            try {
              const data = await api.saver.save();
              setContent(data);
            } catch (error) {
              console.warn('Live update failed:', error);
            }
          },
          onReady: () => {
            console.log('Editor.js is ready to work!');
            setIsLoading(false);
          }
        });

        editorInstance.current = editor;
        
      } catch (err) {
        console.error('EditorJS initialization error:', err);
        setError('Failed to load Editor.js: ' + err.message);
        setIsLoading(false);
        isInitialized.current = false; // Reset on error
      }
    };

  // Cleanup function
  useEffect(() => {
    return () => {
      isInitialized.current = false;
      
      if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
        editorInstance.current.destroy()
          .then(() => {
            console.log('Editor destroyed successfully');
          })
          .catch((error) => {
            console.warn('Error during cleanup:', error);
          })
          .finally(() => {
            editorInstance.current = null;
          });
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editorInstance.current) {
      try {
        const outputData = await editorInstance.current.save();
        setContent(outputData);
        setSubmittedContent(outputData);
      } catch (error) {
        console.error('Saving failed:', error);
        setError('Failed to save content: ' + error.message);
      }
    }
  };

  const handleClear = async () => {
    setSubmittedContent(null);
    setContent(null);
    if (editorInstance.current && typeof editorInstance.current.clear === 'function') {
      try {
        await editorInstance.current.clear();
        // Add some default content after clearing
        await editorInstance.current.render({
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Start typing your new content here...'
              }
            }
          ]
        });
      } catch (error) {
        console.error('Clear failed:', error);
      }
    }
  };

  // Toolbar functions
  const insertHeader = async (level = 2) => {
    if (editorInstance.current && typeof editorInstance.current.blocks === 'object') {
      try {
        const api = editorInstance.current;
        await api.blocks.insert('header', {
          text: 'New Header',
          level: level
        });
      } catch (error) {
        console.error('Insert header failed:', error);
      }
    }
  };

  const insertList = async (style = 'unordered') => {
    if (editorInstance.current && typeof editorInstance.current.blocks === 'object') {
      try {
        const api = editorInstance.current;
        await api.blocks.insert('list', {
          style: style,
          items: ['New list item']
        });
      } catch (error) {
        console.error('Insert list failed:', error);
      }
    }
  };

  const insertQuote = async () => {
    if (editorInstance.current && typeof editorInstance.current.blocks === 'object') {
      try {
        const api = editorInstance.current;
        await api.blocks.insert('quote', {
          text: 'Enter your quote here',
          caption: 'Quote author'
        });
      } catch (error) {
        console.error('Insert quote failed:', error);
      }
    }
  };

  const renderContent = (data) => {
    if (!data || !data.blocks) return null;

    return data.blocks.map((block, index) => {
      switch (block.type) {
        case 'header':
          const HeaderTag = `h${block.data.level || 2}`;
          return React.createElement(HeaderTag, { 
            key: index,
            className: 'mb-3'
          }, block.data.text);
        case 'paragraph':
          return (
            <p key={index} className="mb-3" dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
          );
        case 'list':
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          return React.createElement(
            ListTag,
            { key: index, className: 'mb-3' },
            block.data.items.map((item, itemIndex) => (
              <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }}></li>
            ))
          );
        case 'quote':
          return (
            <blockquote key={index} className="blockquote mb-3">
              <p className="mb-2" dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
              {block.data.caption && (
                <footer className="blockquote-footer">
                  <cite dangerouslySetInnerHTML={{ __html: block.data.caption }}></cite>
                </footer>
              )}
            </blockquote>
          );
        default:
          return <div key={index} className="mb-3">Unsupported block type: {block.type}</div>;
      }
    });
  };

  const rteInfo = {
    name: 'Editor.js',
    url: 'https://editorjs.io/',
    pricing: 'Free',
    license: 'Apache-2.0 License',
    pros: [
      'Block-based editing approach',
      'JSON output format',
      'Extensible plugin system',
      'Clean and modern UI',
      'API-first design'
    ],
    cons: [
      'Requires plugins for basic formatting',
      'Limited built-in features',
      'Different paradigm from traditional RTEs',
      'Smaller community',
      'Learning curve for block-based editing',
      'Plugin ecosystem still growing'
    ]
  };

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">
              <i className="bi bi-house me-1"></i>Home
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            <i className="bi bi-grid-3x3-gap me-1"></i>Editor.js
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-secondary text-white p-4 rounded">
            <h1 className="display-5 mb-3">
              <i className="bi bi-grid-3x3-gap me-3"></i>
              Editor.js
            </h1>
            <p className="lead mb-0">
              A block-styled editor with clean JSON output. 
              Each block is an independent content unit supported by individual tools.
            </p>
          </div>
        </div>
      </div>

      {/* RTE Information */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-check-circle me-2"></i>
                Pros
              </h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                {rteInfo.pros.map((pro, index) => (
                  <li key={index} className="mb-2">
                    <i className="bi bi-plus-circle text-success me-2"></i>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">
                <i className="bi bi-x-circle me-2"></i>
                Cons
              </h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                {rteInfo.cons.map((con, index) => (
                  <li key={index} className="mb-2">
                    <i className="bi bi-dash-circle text-danger me-2"></i>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* RTE Details */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Editor Details
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-2">
                  <strong>Website:</strong>
                </div>
                <div className="col-md-9 mb-2">
                  <a href={rteInfo.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                    {rteInfo.url}
                  </a>
                </div>
                <div className="col-md-3 mb-2">
                  <strong>Pricing:</strong>
                </div>
                <div className="col-md-9 mb-2">
                  <span className="badge bg-success">{rteInfo.pricing}</span>
                </div>
                <div className="col-md-3 mb-2">
                  <strong>License:</strong>
                </div>
                <div className="col-md-9 mb-2">
                  <span className="badge bg-info text-dark">{rteInfo.license}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-grid-3x3-gap me-2"></i>
                Try Editor.js with Toolbar
              </h5>
            </div>
            <div className="card-body">
              {/* Custom Toolbar */}
              {!isLoading && !error && (
                <div className="mb-3">
                  <div className="btn-toolbar" role="toolbar" aria-label="Editor toolbar">
                    <div className="btn-group me-2" role="group" aria-label="Headers">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => insertHeader(1)}
                        title="Insert H1"
                      >
                        <i className="bi bi-type-h1"></i>
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => insertHeader(2)}
                        title="Insert H2"
                      >
                        <i className="bi bi-type-h2"></i>
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => insertHeader(3)}
                        title="Insert H3"
                      >
                        <i className="bi bi-type-h3"></i>
                      </button>
                    </div>
                    
                    <div className="btn-group me-2" role="group" aria-label="Lists">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => insertList('unordered')}
                        title="Insert Bullet List"
                      >
                        <i className="bi bi-list-ul"></i>
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => insertList('ordered')}
                        title="Insert Numbered List"
                      >
                        <i className="bi bi-list-ol"></i>
                      </button>
                    </div>
                    
                    <div className="btn-group" role="group" aria-label="Content">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={insertQuote}
                        title="Insert Quote"
                      >
                        <i className="bi bi-quote"></i>
                      </button>
                    </div>
                  </div>
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Use the toolbar above to quickly insert content blocks, or use the + button in the editor.
                  </small>
                </div>
              )}

              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                <strong>How to use:</strong> 
                <ul className="mb-0 mt-2">
                  <li>Click anywhere to start editing</li>
                  <li>Use the plus (+) button or toolbar to add new blocks</li>
                  <li>Try keyboard shortcuts: Cmd+Shift+H (Header), Cmd+Shift+L (List), Cmd+Shift+O (Quote)</li>
                  <li>Drag blocks to reorder them</li>
                </ul>
              </div>

              {isLoading && (
                <div className="loading-spinner">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading editor...</span>
                  </div>
                  <p className="mt-2 text-center">Loading Editor.js...</p>
                </div>
              )}

              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Error:</strong> {error}
                  <br />
                  <small>Please ensure all EditorJS scripts are loaded properly.</small>
                </div>
              )}

              {!error && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Create your content with blocks:
                    </label>
                    <div 
                      id="editorjs-container"
                      ref={editorContainerRef}
                      className="border rounded p-3" 
                      style={{ 
                        minHeight: '400px',
                        backgroundColor: '#fafafa'
                      }}
                    ></div>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-secondary"
                      disabled={isLoading}
                    >
                      <i className="bi bi-check-lg me-2"></i>
                      Submit Content
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={handleClear}
                      disabled={isLoading}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Clear & Reset
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {submittedContent && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-eye me-2"></i>
                  Submitted Content
                </h5>
              </div>
              <div className="card-body">
                <div className="rte-content-display">
                  {renderContent(submittedContent)}
                </div>
                <hr />
                <details className="mt-3">
                  <summary className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-code me-1"></i>
                    View JSON Output
                  </summary>
                  <pre className="bg-light p-3 mt-3 rounded" style={{ maxHeight: '300px', overflow: 'auto' }}>
                    <code>{JSON.stringify(submittedContent, null, 2)}</code>
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Implementation Note */}
      {/* <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-success">
            <h6 className="alert-heading">
              <i className="bi bi-check-circle me-2"></i>
              Full Editor.js Implementation
            </h6>
            <p className="mb-0">
              This is a complete Editor.js implementation with:
              <br />
              • <strong>Block-based editing:</strong> Headers, Paragraphs, Lists, Quotes
              <br />
              • <strong>Custom toolbar:</strong> Quick insert buttons for common blocks
              <br />
              • <strong>Keyboard shortcuts:</strong> Cmd+Shift+H (Header), Cmd+Shift+L (List), Cmd+Shift+O (Quote)
              <br />
              • <strong>JSON output:</strong> Clean, structured data format
              <br />
              • <strong>Drag & drop:</strong> Reorder blocks by dragging
              <br />
              <code>Libraries: @editorjs/editorjs, @editorjs/header, @editorjs/paragraph, @editorjs/list, @editorjs/quote</code>
            </p>
          </div>
        </div>
      </div> */}

      {/* Navigation */}
      <div className="row">
        <div className="col-12 text-center">
          <Link to="/lexical" className="btn btn-outline-secondary me-2">
            <i className="bi bi-arrow-left me-2"></i>
            Previous: Lexical
          </Link>
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              window.location.href = `${process.env.PUBLIC_URL || ''}/#/`;
              window.location.reload();
            }}
          >
            <i className="bi bi-house me-2"></i>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorJSPage;