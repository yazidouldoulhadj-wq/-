import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#E4F6EB] flex items-center justify-center p-4 text-center">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md shadow-xl border border-emerald-100">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2 font-arabic">
              حدث خطأ غير متوقع أثناء التحميل
            </h2>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              يرجى إعادة تحميل الصفحة أو التأكد من اتصال الإنترنت.
            </p>

            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة تحميل التطبيق</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
