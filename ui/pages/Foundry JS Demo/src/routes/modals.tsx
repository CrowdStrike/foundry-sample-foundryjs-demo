import { useState } from "react";
import { useFalconApiContext } from "../contexts/falcon-api-context.tsx";
import { ModalsDemoUI } from "../components/modals-demo-presentational.tsx";

// Modal page ID from manifest.yml
// To find this ID: Check your manifest.yml under ui.pages section
// Look for a page with type: "modal" and copy its id value
// Example: ui.pages.my_modal_page.id = "foundry_js_demo_modal"
// If you haven't created a modal page yet, you'll need to:
// 1. Add a modal page entry in manifest.yml
// 2. Create the modal component/page
// 3. Set the ID here
const MODAL_PAGE_ID = "foundry_js_demo_modal";

interface ModalConfig {
  id: string;
  type: string;
  title: string;
  path: string;
  data: string;
  size: string;
  align: string;
}

interface ModalResult {
  success?: boolean;
  data?: unknown;
  message?: string;
  returnData?: unknown;
}

export function Modals() {
  const { falcon } = useFalconApiContext();
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    id: MODAL_PAGE_ID,
    type: "page",
    title: "Demo Modal Content",
    path: "/modal-demo",
    data: JSON.stringify(
      {
        userId: "demo-user-123",
        mode: "interactive",
        theme: "gradient",
        features: ["data-display", "close-actions", "parent-communication"],
      },
      null,
      2
    ),
    size: "lg",
    align: "top",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ModalResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openModal = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      if (!falcon?.ui?.openModal) {
        throw new Error("Modal functionality not available");
      }

      // Validate Page ID format (should be a 32-character UUID without dashes)
      const pageId = modalConfig.id.trim();
      if (!pageId || pageId.length !== 32) {
        throw new Error(
          "Invalid Page ID format. Check your manifest.yml for the correct page ID."
        );
      }

      let modalData = {};
      if (modalConfig.data.trim()) {
        modalData = JSON.parse(modalConfig.data);
      }

      const modalOptions: any = {
        path: modalConfig.path.trim() || "/",
        data: modalData,
        size: modalConfig.size,
        ...(modalConfig.align && { align: modalConfig.align }),
      };

      console.log("Opening modal with config:", {
        id: modalConfig.id,
        type: modalConfig.type,
        title: modalConfig.title,
        options: modalOptions,
      });

      const result = await falcon.ui.openModal(
        {
          id: modalConfig.id.trim(),
          type: modalConfig.type as "page",
        },
        modalConfig.title.trim(),
        modalOptions
      );

      setResults({
        success: true,
        data: result,
        message: "Modal opened and closed successfully",
        returnData: result || null,
      });
    } catch (err) {
      console.error("Modal error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to open modal";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = async (returnData: unknown = null) => {
    if (!falcon?.ui?.closeModal) {
      setError("Modal close functionality not available");
      return;
    }

    try {
      await falcon.ui.closeModal(returnData);
      setResults({
        success: true,
        message: "Modal closed programmatically",
        returnData: returnData,
      });
    } catch (err) {
      console.error("Modal close error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to close modal";
      setError(errorMessage);
    }
  };

  const loadExampleUserModal = () => {
    setModalConfig({
      id: MODAL_PAGE_ID,
      type: "page",
      title: "User Profile Demo",
      path: "/modal-demo",
      data: JSON.stringify(
        {
          userId: "user-456",
          mode: "profile_edit",
          fields: ["name", "email", "department", "role"],
          permissions: ["read", "write", "admin"],
          theme: "professional",
        },
        null,
        2
      ),
      size: "lg",
      align: "top",
    });
  };

  const loadExampleReportModal = () => {
    setModalConfig({
      id: MODAL_PAGE_ID,
      type: "page",
      title: "Security Report Viewer",
      path: "/modal-demo",
      data: JSON.stringify(
        {
          reportId: "SEC-2024-001",
          type: "security_report",
          format: "detailed",
          includeCharts: true,
          timeRange: "30d",
          classification: "confidential",
        },
        null,
        2
      ),
      size: "xl",
      align: "",
    });
  };

  const loadExampleSettingsModal = () => {
    setModalConfig({
      id: MODAL_PAGE_ID,
      type: "page",
      title: "Application Settings",
      path: "/modal-demo",
      data: JSON.stringify(
        {
          section: "security_preferences",
          editMode: true,
          theme: "dark",
          notifications: true,
          autoSave: false,
        },
        null,
        2
      ),
      size: "md",
      align: "top",
    });
  };

  return (
    <div className="bg-basement min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-titles-and-attributes mb-2">
            Modals Demo
          </h1>
          <p className="text-body-and-labels">
            Open and manage modals within Falcon Console with data passing.
          </p>
        </div>
        <ModalsDemoUI
          modalConfig={modalConfig}
          loading={loading}
          results={results}
          error={error}
          connectionStatus={{ connected: falcon?.isConnected }}
          onConfigChange={setModalConfig}
          onOpenModal={openModal}
          onCloseModal={closeModal}
          onLoadUserModal={loadExampleUserModal}
          onLoadReportModal={loadExampleReportModal}
          onLoadSettingsModal={loadExampleSettingsModal}
        />
      </div>
    </div>
  );
}
