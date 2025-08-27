import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home Page Component
 * Landing page with overview of all RTEs and navigation links
 */
const Home = () => {
  const rteData = [
    {
      name: 'TinyMCE',
      route: 'tinymce',
      description: 'Feature-rich WYSIWYG editor with MS Word-like interface',
      pricing: 'Free tier 1,000 loads/month; Paid from $92/month',
      license: 'Commercial',
      icon: 'pencil-square',
      color: 'primary'
    },
    {
      name: 'Quill (React-Quill)',
      route: 'quill',
      description: 'Lightweight, modular rich text editor with clean API',
      pricing: 'Free',
      license: 'BSD License',
      icon: 'feather',
      color: 'success'
    },
    {
      name: 'Lexical',
      route: 'lexical',
      description: 'Modern, accessible rich text editor from Facebook',
      pricing: 'Free',
      license: 'MIT License',
      icon: 'code-square',
      color: 'warning'
    },
    {
      name: 'Editor.js',
      route: 'editorjs',
      description: 'Block-based editor with JSON output',
      pricing: 'Free',
      license: 'Apache-2.0 License',
      icon: 'grid-3x3-gap',
      color: 'secondary'
    }
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="text-center bg-light p-5 rounded">
            <h1 className="display-4 text-primary mb-4">
              <i className="bi bi-journal-text me-3"></i>
              React Rich Text Editors Demo
            </h1>
            <p className="lead mb-4">
              Compare and test 5 popular React Rich Text Editors (RTEs) in one place. 
              Each editor is fully functional - try typing, formatting, and see how they work!
            </p>
            <p className="text-muted">
              This demo showcases integration, features, pros, cons, and pricing of each RTE 
              to help you choose the best one for your React application.
            </p>
          </div>
        </div>
      </div>

      {/* RTE Cards Grid */}
      <div className="row">
        {rteData.map((rte) => (
          <div className="col-lg-6 col-xl-4 mb-4" key={rte.route}>
            <div className="card h-100 shadow-sm border-0">
              <div className={`card-header bg-${rte.color} text-white text-center`}>
                <i className={`bi bi-${rte.icon} fs-2 mb-2`}></i>
                <h5 className="card-title mb-0">{rte.name}</h5>
              </div>
              <div className="card-body d-flex flex-column">
                <p className="card-text mb-3">{rte.description}</p>

                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-tag me-1"></i>
                    <strong>Pricing:</strong> {rte.pricing}
                  </small>
                </div>

                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-shield-check me-1"></i>
                    <strong>License:</strong> {rte.license}
                  </small>
                </div>

                <div className="mt-auto">
                  <Link 
                    to={`/${rte.route}`}
                    className={`btn btn-${rte.color} w-100 d-flex align-items-center justify-content-center`}
                  >
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    Try {rte.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">
                <i className="bi bi-table me-2"></i>
                Quick Comparison
              </h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Editor</th>
                      <th>Bundle Size</th>
                      <th>Learning Curve</th>
                      <th>Customization</th>
                      <th>Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>TinyMCE</strong></td>
                      <td><span className="badge bg-danger">Large</span></td>
                      <td><span className="badge bg-success">Easy</span></td>
                      <td><span className="badge bg-success">High</span></td>
                      <td>Enterprise apps, CMS</td>
                    </tr>
                    <tr>
                      <td><strong>Quill</strong></td>
                      <td><span className="badge bg-success">Small</span></td>
                      <td><span className="badge bg-success">Easy</span></td>
                      <td><span className="badge bg-warning">Medium</span></td>
                      <td>Simple editors, blogs</td>
                    </tr>
                    <tr>
                      <td><strong>Lexical</strong></td>
                      <td><span className="badge bg-success">Small</span></td>
                      <td><span className="badge bg-warning">Medium</span></td>
                      <td><span className="badge bg-success">High</span></td>
                      <td>Modern apps, accessibility</td>
                    </tr>
                    <tr>
                      <td><strong>Editor.js</strong></td>
                      <td><span className="badge bg-success">Small</span></td>
                      <td><span className="badge bg-warning">Medium</span></td>
                      <td><span className="badge bg-success">High</span></td>
                      <td>Block-based content, APIs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="row mt-5 mb-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5 className="alert-heading">
              <i className="bi bi-info-circle me-2"></i>
              Getting Started
            </h5>
            <p className="mb-0">
              Click on any editor above to see it in action! Each page includes a working editor, 
              submit functionality, and detailed information about pros, cons, and use cases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
