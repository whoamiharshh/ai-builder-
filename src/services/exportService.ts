import api from '../api';

export interface ExportConfig {
  format: string;
  title: string;
  content: any;
  metadata?: {
    author?: string;
    created?: Date;
    tags?: string[];
  };
}

export interface ExportRecord {
  id: string;
  user_id: string;
  format: string;
  title: string;
  filename: string;
  size: number;
  created_at: string;
}

export const exportService = {
  /**
   * Get available export formats
   */
  async getFormats(): Promise<string[]> {
    try {
      const response = await api.get('/export/formats');
      return response.data.formats;
    } catch (error) {
      console.error('Failed to fetch export formats:', error);
      throw error;
    }
  },

  /**
   * Export content in specified format
   */
  async export(config: ExportConfig): Promise<Blob> {
    try {
      const response = await api.post('/export', config, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  },

  /**
   * Export and download file
   */
  async exportAndDownload(config: ExportConfig): Promise<void> {
    try {
      const blob = await this.export(config);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.title.toLowerCase().replace(/\s+/g, '-')}.${config.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download export:', error);
      throw error;
    }
  },

  /**
   * Get user's export history
   */
  async getExports(): Promise<ExportRecord[]> {
    try {
      const response = await api.get('/exports');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch exports:', error);
      throw error;
    }
  },

  /**
   * Get file size in human-readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },
};

export default exportService;
