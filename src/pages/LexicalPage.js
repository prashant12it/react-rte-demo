import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { $getRoot, $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND, UNDO_COMMAND, REDO_COMMAND, CAN_UNDO_COMMAND, CAN_REDO_COMMAND } from 'lexical';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
/**
 * Lexical Page Component
 * Full-featured Lexical editor with comprehensive toolbar
 */

// Toolbar Component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, []);

  useEffect(() => {
    const mergeRegister = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      1
    );

    const unregisterCanUndo = editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload);
        return false;
      },
      1
    );

    const unregisterCanRedo = editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload);
        return false;
      },
      1
    );

    return () => {
      mergeRegister();
      unregisterCanUndo();
      unregisterCanRedo();
    };
  }, [editor, updateToolbar]);

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  const insertUnorderedList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const insertOrderedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const indentContent = () => {
    editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
  };

  const outdentContent = () => {
    editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
  };

  const undo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const redo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return (
    <div className="toolbar border-bottom p-2 mb-3">
      <div className="d-flex flex-wrap gap-1">
        {/* Undo/Redo */}
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={redo}
          disabled={!canRedo}
          title="Redo"
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>

        <div className="vr mx-1"></div>

        {/* Text Formatting */}
        <button
          className={`btn btn-sm ${isBold ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => formatText('bold')}
          title="Bold"
        >
          <i className="bi bi-type-bold"></i>
        </button>
        <button
          className={`btn btn-sm ${isItalic ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => formatText('italic')}
          title="Italic"
        >
          <i className="bi bi-type-italic"></i>
        </button>
        <button
          className={`btn btn-sm ${isUnderline ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => formatText('underline')}
          title="Underline"
        >
          <i className="bi bi-type-underline"></i>
        </button>

        <div className="vr mx-1"></div>

        {/* Lists */}
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={insertUnorderedList}
          title="Bullet List"
        >
          <i className="bi bi-list-ul"></i>
        </button>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={insertOrderedList}
          title="Numbered List"
        >
          <i className="bi bi-list-ol"></i>
        </button>

        <div className="vr mx-1"></div>

        {/* Indentation */}
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={outdentContent}
          title="Decrease Indent"
        >
          <i className="bi bi-indent"></i>
        </button>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={indentContent}
          title="Increase Indent"
        >
          <i className="bi bi-text-indent-right"></i>
        </button>

        <div className="vr mx-1"></div>

        {/* Link */}
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={insertLink}
          title="Insert Link"
        >
          <i className="bi bi-link-45deg"></i>
        </button>
      </div>
    </div>
  );
}

const theme = {
  text: {
    bold: 'fw-bold',
    italic: 'fst-italic',
    underline: 'text-decoration-underline',
  },
  link: 'text-primary text-decoration-none',
  list: {
    nested: {
      listitem: 'ms-4',
    },
    ol: 'list-group list-group-numbered',
    ul: 'list-group',
    listitem: 'list-group-item border-0 p-1',
  },
  quote: 'border-start border-5 border-secondary ps-3 text-muted fst-italic',
};

function onError(error) {
  console.error(error);
}
// Plugin to capture editor state changes
function EditorCapturePlugin({ setEditorState }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      setEditorState(editorState);
    });
  }, [editor, setEditorState]);

  return null;
}

const LexicalPage = () => {
  const [editorState, setEditorState] = useState(null);
  const [submittedContent, setSubmittedContent] = useState('');

  // Editor configuration
  const initialConfig = {
    namespace: 'LexicalEditor',
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      LinkNode,
    ],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demonstration, we'll just show the current text content
    // In a real implementation, you'd use $generateHtmlFromNodes
    if (editorState) {
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        setSubmittedContent(textContent);
      });
    }
  };

  const handleClear = () => {
    setSubmittedContent('');
    // Clear editor content would need to be handled via editor reference
  };

  const rteInfo = {
    name: 'Lexical',
    url: 'https://lexical.dev/',
    pricing: 'Free',
    license: 'MIT License',
    pros: [
      'Modern architecture',
      'TypeScript support',
      'Great accessibility features',
      'Lightweight and performant',
      'Facebook-backed'
    ],
    cons: [
      'Limited documentation',
      'No IE11 support',
      'Relatively new ecosystem',
      'Fewer plugins available',
      'Complex setup for advanced features',
      'Still evolving'
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
            <i className="bi bi-code-square me-1"></i>Lexical
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-warning text-dark p-4 rounded">
            <h1 className="display-5 mb-3">
              <i className="bi bi-code-square me-3"></i>
              Lexical Editor
            </h1>
            <p className="lead mb-0">
              An extensible text editor framework that provides excellent reliability, accessibility and performance. 
              The successor to Draft.js.
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
                <i className="bi bi-code-square me-2"></i>
                Lexical Rich Text Editor with Toolbar
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Rich Text Editor with Full Toolbar:
                  </label>
                  <LexicalComposer initialConfig={initialConfig}>
                    <div className="border rounded">
                      <ToolbarPlugin />
                      <RichTextPlugin
                        contentEditable={
                          <ContentEditable
                            className="form-control border-0"
                            style={{ minHeight: '200px', outline: 'none' }}
                            aria-placeholder="Enter some rich text..."
                            placeholder={
                              <div className="text-muted p-2">
                                Enter some rich text...
                              </div>
                            }
                          />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                      />
                      <HistoryPlugin />
                      <AutoFocusPlugin />
                      <ListPlugin />
                      <LinkPlugin />
                      <EditorCapturePlugin setEditorState={setEditorState} />
                    </div>
                  </LexicalComposer>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
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

      {/* Implementation Note */}
      {/* <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-success">
            <h6 className="alert-heading">
              <i className="bi bi-check-circle me-2"></i>
              Full Lexical Implementation
            </h6>
            <p className="mb-0">
              This is a complete Lexical implementation with:
              <br />
              • <strong>Text Formatting:</strong> Bold, Italic, Underline
              <br />
              • <strong>History:</strong> Undo/Redo functionality
              <br />
              • <strong>Lists:</strong> Ordered and Unordered lists
              <br />
              • <strong>Indentation:</strong> Increase/Decrease indent
              <br />
              • <strong>Links:</strong> Insert and manage hyperlinks
              <br />
              <code>Packages used: lexical, @lexical/react, @lexical/rich-text, @lexical/list, @lexical/link</code>
            </p>
          </div>
        </div>
      </div> */}

      {/* Navigation */}
      <div className="row">
        <div className="col-12 text-center">
          <Link to="/quill" className="btn btn-outline-secondary me-2">
            <i className="bi bi-arrow-left me-2"></i>
            Previous: Quill
          </Link>
          <Link to="/editorjs" className="btn btn-outline-secondary">
            Next: Try Editor.js
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LexicalPage;
