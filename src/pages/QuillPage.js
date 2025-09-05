import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// Import Quill Font module
const Font = Quill.import('formats/font');

// Add extensive custom font families
Font.whitelist = ['arial','comic-sans', 'courier-new', 'georgia', 'helvetica', 'times-new-roman','trebuchet-ms','verdana','tahoma','impact'];

// Register the custom font list
Quill.register(Font, true);

/**
 * Quill Page Component
 * Integrates React-Quill editor with submit functionality and RTE information
 */
const QuillPage = () => {
  const [content, setContent] = useState('');
  const [submittedContent, setSubmittedContent] = useState('');
  const quillRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedContent(content);
  };

  const handleClear = () => {
    setSubmittedContent('');
    setContent('');
  };
// Insert sample content for demonstration
  const insertSampleContent = () => {
    const sampleContent = `
      <h1>Sample Document with Quill</h1>
      <p><strong>This is bold text</strong>, <em>this is italic</em>, 
      <u>this is underlined</u>, and <s>this is strikethrough</s>.</p>
      
      <h2>Different Header Sizes</h2>
      <h3>This is H3</h3>
      <h4>This is H4</h4>
      
      <blockquote>
        This is an example blockquote. It's perfect for highlighting important 
        information or quotes from other sources.
      </blockquote>
      
      <p>Here's a <a href="https://quilljs.com/" target="_blank">link to Quill documentation</a></p>
      
      <h4>Lists and Alignment</h4>
      <ul>
        <li>Unordered list item 1</li>
        <li>Unordered list item 2</li>
      </ul>
      
      <ol>
        <li>Ordered list item 1</li>
        <li>Ordered list item 2</li>
      </ol>
      
      <p style="text-align: center;">This text is center aligned</p>
      <p style="text-align: right;">This text is right aligned</p>
    `;
    setContent(sampleContent);
  };
  // Quill modules configuration
  const modules = {
    toolbar: [
      // Row 1: Headers and basic formatting
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': Font.whitelist }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      
      // Row 2: Text formatting
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      
      // Row 3: Alignment and lists
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      
      // Row 4: Special formatting and media
      ['blockquote'],
      ['link', 'image'],
      
      // Row 5: Cleanup
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  // Quill formats
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background',
    'clean'
  ];

  const rteInfo = {
    name: 'Quill (React-Quill)',
    url: 'https://www.npmjs.com/package/react-quill',
    pricing: 'Free',
    license: 'BSD License',
    pros: [
      'Lightweight and fast',
      'Clean API',
      'Modular architecture',
      'Large ecosystem of plugins',
      'Easy to integrate',
      'Good performance'
    ],
    cons: [
      'Basic toolbar by default',
      'Limited table support'
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
            <i className="bi bi-feather me-1"></i>Quill
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-success text-white p-4 rounded">
            <h1 className="display-5 mb-3">
              <i className="bi bi-feather me-3"></i>
              Quill Editor
            </h1>
            <p className="lead mb-0">
              A modern WYSIWYG editor built for compatibility and extensibility. 
              Lightweight and easy to integrate.
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
              <hr />
              
              <div className="row">
                <div className="col-12">
                  <h6><i className="bi bi-gear me-2"></i>Available Toolbar Controls:</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li><i className="bi bi-check text-success me-1"></i> Headers (H1-H6)</li>
                        <li><i className="bi bi-check text-success me-1"></i> Font families (Arial, Times, etc.)</li>
                        <li><i className="bi bi-check text-success me-1"></i> Font sizes (8px-72px)</li>
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
                <i className="bi bi-feather me-2"></i>
                Try Quill Editor
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    placeholder="Start typing your content here. Try the toolbar controls above!"
                  />
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button 
                    type="submit" 
                    className="btn btn-success"
                  >
                    <i className="bi bi-check-lg me-2"></i>
                    Submit Content
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={handleClear}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Clear
                  </button>
                </div>
              </form>
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
          <Link to="/tinymce" className="btn btn-outline-secondary me-2">
            <i className="bi bi-arrow-left me-2"></i>
            Previous: TinyMCE
          </Link>
          <Link to="/lexical" className="btn btn-outline-secondary">
            Next: Try Lexical
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuillPage;
