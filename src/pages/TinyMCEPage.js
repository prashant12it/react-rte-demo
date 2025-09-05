import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * TinyMCE Page Component
 * Integrates TinyMCE editor with submit functionality and RTE information
 */
const TinyMCEPage = () => {
  const [content, setContent] = useState('');
  const [submittedContent, setSubmittedContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    // Initialize TinyMCE when component mounts
    const initTinyMCE = async () => {
      try {
        if (window.tinymce) {
          await window.tinymce.init({
            selector: '#tinymce-editor',
            height: 300,
            menubar: false,
            apiKey: process.env.REACT_APP_TINYMCE_API_KEY,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount', 'quickbars'
            ],
            toolbar: 'undo redo | blocks formatselect fontfamily fontsize | ' +
            'bold italic underline strikethrough | forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | blockquote | ' +
            'link unlink | image | removeformat help',
            toolbar_mode: 'sliding',
            toolbar_sticky: true,
            // Font family options
            font_family_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; ' +
                               'Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; ' +
                               'Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; ' +
                               'Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; ' +
                               'Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; ' +
                               'Terminal=terminal,monaco; Times New Roman=times new roman,times; ' +
                               'Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; ' +
                               'Webdings=webdings; Wingdings=wingdings,zapf dingbats',
            
            // Font size options
            fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 30pt 32pt 34pt 36pt 48pt 60pt 72pt',
            
            // Format options (headers)
            block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre',
            
            // Link configuration with target options
            link_default_target: '_self',
            link_assume_external_targets: true,
            link_context_toolbar: true,
            link_title: false,
            target_list: [
              { title: 'Same window', value: '_self' },
              { title: 'New window', value: '_blank' }
            ],
            
            // Image configuration
            image_title: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            images_upload_url: false, // Disable for demo
            images_file_types: 'jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp',
            
            // Image upload handler for demo (converts to base64)
            images_upload_handler: function (blobInfo, success, failure) {
              const reader = new FileReader();
              reader.onload = function() {
                success(reader.result);
              };
              reader.onerror = function() {
                failure('Failed to convert image to base64');
              };
              reader.readAsDataURL(blobInfo.blob());
            },
            content_style: `
              body { 
                font-family: arial, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                font-size: 14px; 
                line-height: 1.6;
                padding: 1rem;
              }
              h1, h2, h3, h4, h5, h6 {
                margin-top: 1em;
                margin-bottom: 0.5em;
                color: #333;
              }
              h1 { font-size: 2em; font-weight: bold; }
              h2 { font-size: 1.5em; font-weight: bold; }
              h3 { font-size: 1.17em; font-weight: bold; }
              h4 { font-size: 1em; font-weight: bold; }
              h5 { font-size: 0.83em; font-weight: bold; }
              h6 { font-size: 0.67em; font-weight: bold; }
              p { margin: 1em 0; }
              blockquote {
                border-left: 4px solid #ccc;
                margin-left: 0;
                padding-left: 1rem;
                font-style: italic;
                color: #666;
              }
              pre {
                background-color: #f4f4f4;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 1rem;
                font-family: 'Courier New', Courier, monospace;
                overflow-x: auto;
              }
              address {
                font-style: italic;
                color: #666;
                margin: 1em 0;
              }
            `,
            setup: (editor) => {
              editorRef.current = editor;
              editor.on('change keyup', () => {
                setContent(editor.getContent());
              });
            },
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
            quickbars_insert_toolbar: 'quickimage quicktable',
            branding: false, // Remove "Powered by TinyMCE" branding
            promotion: false, // Remove upgrade promotion
            resize: 'both',
            statusbar: true,
            elementpath: true,
            a11y_advanced_options: true,
            convert_urls: false,
            remove_script_host: false,
            relative_urls: false
          });
          setIsLoading(false);
        } else {
          throw new Error('TinyMCE not loaded');
        }
      } catch (err) {
        setError('Failed to load TinyMCE editor: ' + err.message);
        setIsLoading(false);
      }
    };

    initTinyMCE();

    // Cleanup on unmount
    return () => {
      if (window.tinymce) {
        window.tinymce.remove('#tinymce-editor');
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editorRef.current) {
      const currentContent = editorRef.current.getContent();
      setSubmittedContent(currentContent);
    }
  };

  const handleClear = () => {
    setSubmittedContent('');
    if (editorRef.current) {
      editorRef.current.setContent('');
      setContent('');
    }
  };

  const rteInfo = {
    name: 'TinyMCE',
    url: 'https://www.tiny.cloud/',
    pricing: 'Free tier 1,000 loads/month; Paid from $92/month',
    license: 'Commercial',
    pros: [
      'Extensive plugin marketplace',
      'MS Word-like interface',
      'Strong documentation and support',
      'Enterprise features available',
      'Excellent browser compatibility',
      'Professional appearance'
    ],
    cons: [
      'Large bundle size',
      'Requires API key for cloud version',
      'Performance impact on large documents',
      'Licensing costs for commercial use'
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
            <i className="bi bi-pencil-square me-1"></i>TinyMCE
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-primary text-white p-4 rounded">
            <h1 className="display-5 mb-3">
              <i className="bi bi-pencil-square me-3"></i>
              TinyMCE Editor
            </h1>
            <p className="lead mb-0">
              The world's #1 JavaScript library for rich text editing. 
              Trusted by millions of developers worldwide.
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
                  {rteInfo.pricing}
                </div>
                <div className="col-md-3 mb-2">
                  <strong>License:</strong>
                </div>
                <div className="col-md-9 mb-2">
                  <span className="badge bg-warning text-dark">{rteInfo.license}</span>
                </div>
              </div>
              <hr />
              
              <div className="row">
                <div className="col-12">
                  <h6><i className="bi bi-gear me-2"></i>Available Toolbar Controls:</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li><i className="bi bi-check text-success me-1"></i> Headers (H1-H6)</li>
                        <li><i className="bi bi-check text-success me-1"></i> Font families (Arial, Times, etc.)</li>
                        <li><i className="bi bi-check text-success me-1"></i> Font sizes (8pt-72pt)</li>
                        <li><i className="bi bi-check text-success me-1"></i> Bold, Italic formatting</li>
                        <li><i className="bi bi-check text-success me-1"></i> Underline text</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li><i className="bi bi-check text-success me-1"></i> Strikethrough text</li>
                        <li><i className="bi bi-check text-success me-1"></i> Blockquotes</li>
                        <li><i className="bi bi-check text-success me-1"></i> Links with target options</li>
                        <li><i className="bi bi-check text-success me-1"></i> Image upload/insert</li>
                        <li><i className="bi bi-check text-success me-1"></i> Lists, alignment, colors</li>
                      </ul>
                    </div>
                  </div>
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
                <i className="bi bi-pencil-square me-2"></i>
                Try TinyMCE Editor
              </h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                <strong>How to use the enhanced toolbar:</strong>
                <ul className="mb-0 mt-2">
                  <li><strong>Headers:</strong> Use the format dropdown to select H1-H6</li>
                  <li><strong>Fonts:</strong> Change font family and size using the dropdown menus</li>
                  <li><strong>Text formatting:</strong> Bold, italic, underline, strikethrough buttons</li>
                  <li><strong>Links:</strong> Select text, click link button, choose target (same/new window)</li>
                  <li><strong>Images:</strong> Click image button to upload or insert images</li>
                  <li><strong>Blockquotes:</strong> Use the blockquote button for highlighted text</li>
                </ul>
              </div>
              {isLoading && (
                <div className="loading-spinner">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading editor...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {!error && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="tinymce-editor" className="form-label">
                      Type your content below:
                    </label>
                    <textarea id="tinymce-editor" className="form-control"></textarea>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-submit"
                      disabled={isLoading}
                    >
                      <i className="bi bi-check-lg me-2"></i>
                      Submit Content
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-clear"
                      onClick={handleClear}
                      disabled={isLoading}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Clear
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
                <div className="rte-content-display" dangerouslySetInnerHTML={{ __html: submittedContent }}>
                </div>
                <hr />
                <details className="mt-3">
                  <summary className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-code me-1"></i>
                    View HTML Source
                  </summary>
                  <pre className="bg-light p-3 mt-3 rounded">
                    <code>{submittedContent}</code>
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="row">
        <div className="col-12 text-center">
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => {
              window.location.href = `${process.env.PUBLIC_URL || ''}/#/`;
              window.location.reload();
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Home
          </button>
          <Link to="/quill" className="btn btn-outline-secondary">
            Next: Try Quill
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TinyMCEPage;
