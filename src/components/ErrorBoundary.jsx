import React from "react";
import { Button } from "@/components/ui/button";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("ErrorBoundary caught:", error);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 p-8 min-h-[40vh] text-center">
          <p className="text-sm text-cockpit-muted">Something went wrong</p>
          <Button onClick={this.handleReload} size="sm">
            Tap to reload
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}