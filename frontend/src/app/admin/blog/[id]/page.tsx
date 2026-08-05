"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError, adminApi, api, type BlogCategory, type BlogPost } from "@/lib/api";
import { useAdminFetch } from "@/lib/use-admin-fetch";
import { Button } from "@/components/ui/button";
import { TextField, TextAreaField, SelectField, FormNotice } from "@/components/forms/field";
import { PageHeader } from "@/components/admin/page-header";
import { LoadingState } from "@/components/admin/list-state";

export default function AdminBlogFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "novo";
  const adminFetch = useAdminFetch();
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const categoriesData = await api.blog.listCategories();
        if (cancelled) return;
        setCategories(categoriesData);

        if (!isNew) {
          const { data } = await adminFetch((key) => adminApi.blog.listPostsAdmin(key));
          if (cancelled) return;
          const found = data.find((p) => p.id === id);
          if (!found) {
            setNotice({ type: "error", message: "Post não encontrado." });
          } else {
            setPost(found);
          }
        }
      } catch {
        if (!cancelled) setNotice({ type: "error", message: "Não foi possível carregar os dados." });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title") ?? "").trim(),
      slug: String(form.get("slug") ?? "").trim(),
      excerpt: String(form.get("excerpt") ?? "").trim() || undefined,
      content: String(form.get("content") ?? "").trim(),
      cover_image_url: String(form.get("cover_image_url") ?? "").trim() || undefined,
      category_id: String(form.get("category_id") ?? "").trim() || undefined,
      author_name: String(form.get("author_name") ?? "").trim() || undefined,
      status: (String(form.get("status") ?? "draft")) as "draft" | "published",
    };

    try {
      if (isNew) {
        await adminFetch((key) => adminApi.blog.createPost(key, payload));
      } else {
        await adminFetch((key) => adminApi.blog.updatePost(key, id, payload));
      }
      router.push("/admin/blog");
    } catch (err) {
      setNotice({ type: "error", message: err instanceof ApiError ? err.message : "Erro ao salvar o post." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState label="Carregando post" />;

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <PageHeader eyebrow="Blog" title={isNew ? "Novo post" : "Editar post"} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextField label="Título" name="title" required defaultValue={post?.title} />
        <TextField label="Slug" name="slug" required defaultValue={post?.slug} />
        <TextAreaField label="Resumo" name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} />
        <TextAreaField label="Conteúdo" name="content" rows={10} required defaultValue={post?.content} />
        <TextField
          label="URL da imagem de capa"
          name="cover_image_url"
          type="url"
          defaultValue={post?.cover_image_url ?? ""}
        />
        <TextField label="Autor" name="author_name" defaultValue={post?.author_name ?? ""} />

        <SelectField label="Categoria" name="category_id" defaultValue={post?.category_id ?? ""}>
          <option value="">Sem categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>

        <SelectField label="Status" name="status" defaultValue={post?.status ?? "draft"}>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
        </SelectField>

        <FormNotice status={notice} />

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando…" : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
