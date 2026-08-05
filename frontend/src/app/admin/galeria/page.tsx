"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { ApiError, adminApi, api, type GalleryPhoto } from "@/lib/api";
import { useAdminFetch } from "@/lib/use-admin-fetch";
import { Button } from "@/components/ui/button";
import { FormNotice } from "@/components/forms/field";
import { PageHeader } from "@/components/admin/page-header";
import { LoadingState, EmptyState } from "@/components/admin/list-state";
import { formatDateTime } from "@/lib/format";

export default function AdminGalleryPage() {
  const adminFetch = useAdminFetch();
  const [photos, setPhotos] = useState<GalleryPhoto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    try {
      const { data } = await api.gallery.list({ pageSize: 100 });
      setPhotos(data);
    } catch {
      setError("Não foi possível carregar a galeria.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setNotice(null);

    const formData = new FormData(event.currentTarget);

    try {
      const created = await adminFetch((key) => adminApi.gallery.upload(key, formData));
      setPhotos((prev) => (prev ? [created, ...prev] : [created]));
      setNotice({ type: "success", message: "Foto enviada." });
      event.currentTarget.reset();
    } catch (err) {
      setNotice({ type: "error", message: err instanceof ApiError ? err.message : "Erro ao enviar foto." });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remover esta foto?")) return;
    setDeletingId(id);
    try {
      await adminFetch((key) => adminApi.gallery.remove(key, id));
      setPhotos((prev) => prev?.filter((photo) => photo.id !== id) ?? prev);
    } catch {
      setError("Não foi possível remover a foto.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Galeria" title="Fotos" />

      <form
        onSubmit={handleUpload}
        className="flex flex-wrap items-end gap-4 border border-ink/10 bg-white p-5 shadow-[0_1px_3px_rgba(14,18,16,0.05)]"
      >
        <label className="flex flex-col gap-2">
          <span className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">Arquivo (JPEG/PNG/WebP) *</span>
          <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required className="text-sm" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">Título</span>
          <input name="title" className="border border-ink/20 bg-white px-3 py-2 text-sm" />
        </label>
        <Button type="submit" disabled={uploading}>
          {uploading ? "Enviando…" : "Enviar foto"}
        </Button>
      </form>
      <FormNotice status={notice} />

      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      {!photos ? (
        <LoadingState label="Carregando galeria" />
      ) : photos.length === 0 ? (
        <EmptyState label="Nenhuma foto ainda." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="flex flex-col gap-2 border border-ink/10 bg-white p-2 shadow-[0_1px_3px_rgba(14,18,16,0.05)] transition-shadow hover:shadow-[0_6px_16px_-8px_rgba(14,18,16,0.18)]"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-ink/5">
                <Image src={photo.image_url} alt={photo.title ?? ""} fill className="object-cover" unoptimized />
              </div>
              <p className="truncate text-xs text-ink">{photo.title || "sem título"}</p>
              <p className="text-[11px] text-stone">{formatDateTime(photo.uploaded_at)}</p>
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={deletingId === photo.id}
                className="font-data text-left text-[11px] uppercase tracking-[0.14em] text-red-800 hover:underline"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
