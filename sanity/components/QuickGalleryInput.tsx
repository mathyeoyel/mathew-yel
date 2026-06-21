"use client";

import { useCallback, useRef, useState } from "react";
import { PatchEvent, set, useClient, type ArrayOfObjectsInputProps } from "sanity";
import { Button, Card, Flex, Stack, Text } from "@sanity/ui";

type GalleryImageValue = {
  _key: string;
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
};

function createGalleryImageItem(assetId: string): GalleryImageValue {
  return {
    _key: crypto.randomUUID(),
    _type: "image",
    asset: {
      _type: "reference",
      _ref: assetId
    }
  };
}

export function QuickGalleryInput(props: ArrayOfObjectsInputProps) {
  const { onChange, value, renderDefault } = props;
  const client = useClient({ apiVersion: "2026-06-19" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files?.length) {
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const uploads = await Promise.all(
          Array.from(files).map((file) =>
            client.assets.upload("image", file, {
              filename: file.name
            })
          )
        );

        const existingItems = Array.isArray(value) ? value : [];
        const newItems = uploads.map((asset) => createGalleryImageItem(asset._id));

        onChange(PatchEvent.from(set([...existingItems, ...newItems])));
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
      } finally {
        setUploading(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [client, onChange, value]
  );

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} border tone="transparent">
        <Stack space={3}>
          <Text size={1} muted>
            Select multiple files to append them to this gallery. Existing images stay in place.
          </Text>
          <Flex align="center" gap={3} wrap="wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleUpload}
            />
            <Button
              text={uploading ? "Uploading..." : "Upload multiple images"}
              tone="primary"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            />
            {uploading ? <Text size={1}>Uploading images...</Text> : null}
          </Flex>
          {error ? (
            <Text size={1} style={{ color: "var(--card-badge-critical-fg-color, #f03)" }}>
              {error}
            </Text>
          ) : null}
        </Stack>
      </Card>
      {renderDefault(props)}
    </Stack>
  );
}
