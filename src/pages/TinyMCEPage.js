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
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family: Arial, sans-serif; font-size: 14px }',
            setup: (editor) => {
              editorRef.current = editor;
              editor.on('change keyup', () => {
                setContent(editor.getContent());
              });
            }
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
      'Resource intensive',
      'Requires API key for cloud version',
      'Can be complex to configure',
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
          <Link to="/" className="btn btn-outline-primary me-2">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Home
          </Link>
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
