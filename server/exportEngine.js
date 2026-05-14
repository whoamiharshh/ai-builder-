import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

// Supported export formats
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  DOCX: 'docx',
  JSON: 'json',
  MARKDOWN: 'markdown',
  HTML: 'html',
};

/**
 * Export engine for generating documents in various formats
 */
export class ExportEngine {
  /**
   * Generate PDF export
   */
  static async generatePDF(config) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
        });

        const buffers = [];

        doc.on('data', (chunk) => {
          buffers.push(chunk);
        });

        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });

        doc.on('error', (err) => {
          reject(err);
        });

        // Add content to PDF
        doc.fontSize(24).font('Helvetica-Bold').text(config.title, { align: 'center' });
        doc.moveDown();

        if (config.metadata?.author) {
          doc.fontSize(10).font('Helvetica').text(`Author: ${config.metadata.author}`);
        }

        if (config.metadata?.created) {
          doc.fontSize(10).text(`Created: ${config.metadata.created.toLocaleDateString()}`);
        }

        doc.moveDown();
        doc.fontSize(12).font('Helvetica').text(JSON.stringify(config.content, null, 2));

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate JSON export
   */
  static async generateJSON(config) {
    const data = {
      title: config.title,
      format: 'json',
      created: new Date().toISOString(),
      metadata: config.metadata,
      content: config.content,
    };

    return Buffer.from(JSON.stringify(data, null, 2), 'utf-8');
  }

  /**
   * Generate Markdown export
   */
  static async generateMarkdown(config) {
    let markdown = `# ${config.title}\n\n`;

    if (config.metadata?.author) {
      markdown += `**Author:** ${config.metadata.author}\n\n`;
    }

    if (config.metadata?.created) {
      markdown += `**Created:** ${config.metadata.created.toLocaleDateString()}\n\n`;
    }

    if (config.metadata?.tags && config.metadata.tags.length > 0) {
      markdown += `**Tags:** ${config.metadata.tags.join(', ')}\n\n`;
    }

    markdown += '---\n\n';
    markdown += JSON.stringify(config.content, null, 2);

    return Buffer.from(markdown, 'utf-8');
  }

  /**
   * Generate HTML export
   */
  static async generateHTML(config) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #f9f9f9;
    }
    h1 { color: #0066cc; margin-bottom: 10px; }
    .metadata { color: #666; font-size: 14px; margin-bottom: 30px; }
    .divider { border-top: 1px solid #ddd; margin: 30px 0; }
    pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    code { font-family: 'Courier New', monospace; }
  </style>
</head>
<body>
  <h1>${config.title}</h1>
  <div class="metadata">
    ${config.metadata?.author ? `<p><strong>Author:</strong> ${config.metadata.author}</p>` : ''}
    ${config.metadata?.created ? `<p><strong>Created:</strong> ${config.metadata.created.toLocaleDateString()}</p>` : ''}
    ${config.metadata?.tags ? `<p><strong>Tags:</strong> ${config.metadata.tags.join(', ')}</p>` : ''}
  </div>
  <div class="divider"></div>
  <pre><code>${JSON.stringify(config.content, null, 2)}</code></pre>
</body>
</html>`;

    return Buffer.from(html, 'utf-8');
  }

  /**
   * Generate export in the specified format
   */
  static async export(config) {
    switch (config.format.toLowerCase()) {
      case EXPORT_FORMATS.PDF:
        return this.generatePDF(config);
      case EXPORT_FORMATS.JSON:
        return this.generateJSON(config);
      case EXPORT_FORMATS.MARKDOWN:
        return this.generateMarkdown(config);
      case EXPORT_FORMATS.HTML:
        return this.generateHTML(config);
      default:
        throw new Error(`Unsupported export format: ${config.format}`);
    }
  }

  /**
   * Get filename with appropriate extension
   */
  static getFilename(title, format) {
    const sanitized = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const extension = format.toLowerCase();
    return `${sanitized}.${extension}`;
  }
}

export default ExportEngine;
