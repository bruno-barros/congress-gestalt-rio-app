import AuthToken from "./auth-token";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import Portuguese from "@uppy/locales/lib/pt_BR";
import useEvent from "../../components/hooks/useEvent";

interface UppyInterface {
  locale?: string;
  max_size?: number;
  allowedFileTypes?: string[];
}

export function uppyAvatar(args?: UppyInterface) {
  return () => {
    const auth = AuthToken.factory();
    const token = AuthToken.getToken();
    const uppy = Uppy({
      locale: args?.locale === "pt" ? Portuguese : null,
      meta: { type: "avatar" },
      restrictions: {
        maxFileSize: (args?.max_size && args.max_size * 1024 * 1024) || 5242880,
        maxNumberOfFiles: 1,
        minNumberOfFiles: null,
        allowedFileTypes: ["image/*"],
      },
      autoProceed: true,
    });
    uppy.use(XHRUpload, {
      headers: {
        Authorization: auth.isValid ? `Bearer ${token}` : "",
      },
      endpoint: `${process.env.apiUrl}/wp-admin/admin-ajax.php?action=ev_avatar_upload`,
    });
    return uppy;
  };
}

export function uppyDocument(args?: UppyInterface) {
  return () => {
    const auth = AuthToken.factory();
    const token = AuthToken.getToken();
    const uppy = Uppy({
      locale: args?.locale === "pt" ? Portuguese : null,
      meta: { type: "document" },
      restrictions: {
        maxFileSize: (args?.max_size && args.max_size * 1024 * 1024) || 5242880,
        maxNumberOfFiles: 1,
        minNumberOfFiles: null,
        allowedFileTypes: [
          "application/pdf",
          ".doc",
          ".docx",
          ".xls",
          ".xlsx",
          ".ppt",
          ".pptx",
          "image/*",
        ],
      },
      autoProceed: true,
    });
    uppy.use(XHRUpload, {
      headers: {
        Authorization: auth.isValid ? `Bearer ${token}` : "",
      },
      endpoint: `${process.env.apiUrl}/wp-admin/admin-ajax.php?action=ev_document_upload`,
    });
    return uppy;
  };
}


export function uppyUploadV1(args?: UppyInterface) {
  return () => {
    const auth = AuthToken.factory();
    const token = AuthToken.getToken();
    const uppy = Uppy({
      locale: args?.locale === "pt" ? Portuguese : null,
      meta: { type: "document" },
      restrictions: {
        maxFileSize: (args?.max_size && args.max_size * 1024 * 1024) || 5242880,
        maxNumberOfFiles: 1,
        minNumberOfFiles: null,
        allowedFileTypes: args?.allowedFileTypes || [
          "application/pdf",
          ".doc",
          ".docx",
          ".xls",
          ".xlsx",
          ".ppt",
          ".pptx",
          "image/*",
        ],
      },
      autoProceed: true,
    });
    uppy.use(XHRUpload, {
      headers: {
        Authorization: auth.isValid ? `Bearer ${token}` : "",
      },
      endpoint: `${process.env.apiUrl}/wp-json/event/v1/upload`,
    });
    return uppy;
  };
}
