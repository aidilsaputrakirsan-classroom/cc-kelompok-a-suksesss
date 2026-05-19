import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#f0eeff' }}>
          <h2>😥 Maaf, terjadi kesalahan</h2>
          <p>Tim kami sudah diberitahu. Silakan refresh halaman atau coba lagi nanti.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;