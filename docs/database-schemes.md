# Database Schemes — CC-Kelompok-A-Suksesss

> Dokumentasi skema database untuk proyek Cloud App API  
> Mata Kuliah: Komputasi Awan — SI ITK  
> Tim: cloud-team-suksesss

---

## Teknologi

| Komponen     | Teknologi                        |
|--------------|----------------------------------|
| ORM          | SQLAlchemy                       |
| Validasi     | Pydantic v2                      |
| Database     | PostgreSQL (via `DATABASE_URL`)  |
| Framework    | FastAPI 0.2.0                    |

---

## Tabel: `items`

Tabel utama yang menyimpan data inventory/barang pada aplikasi.

### DDL (Struktur Tabel)

```sql
CREATE TABLE items (
    id          SERIAL          PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    description TEXT            NULL,
    price       FLOAT           NOT NULL,
    quantity    INTEGER         NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ     DEFAULT now(),
    updated_at  TIMESTAMPTZ     NULL
);
```

### Deskripsi Kolom

| Kolom        | Tipe             | Constraint                   | Keterangan                                      |
|--------------|------------------|------------------------------|-------------------------------------------------|
| `id`         | `INTEGER`        | PK, AUTO INCREMENT, NOT NULL | Identitas unik setiap item                      |
| `name`       | `VARCHAR(100)`   | NOT NULL, INDEXED            | Nama item, wajib diisi, maks 100 karakter       |
| `description`| `TEXT`           | NULLABLE                     | Deskripsi item, boleh kosong                    |
| `price`      | `FLOAT`          | NOT NULL                     | Harga item, wajib diisi, harus lebih dari 0     |
| `quantity`   | `INTEGER`        | NOT NULL, DEFAULT 0          | Jumlah stok item, default 0, tidak boleh negatif|
| `created_at` | `TIMESTAMPTZ`    | DEFAULT now()                | Waktu item dibuat (otomatis oleh server)        |
| `updated_at` | `TIMESTAMPTZ`    | NULLABLE                     | Waktu item terakhir diperbarui (otomatis)       |

### Index

| Nama Index         | Kolom  | Tipe    | Keterangan                     |
|--------------------|--------|---------|--------------------------------|
| `items_pkey`       | `id`   | PRIMARY | Primary key index              |
| `ix_items_id`      | `id`   | UNIQUE  | Index pada primary key         |
| `ix_items_name`    | `name` | INDEX   | Mempercepat pencarian by name  |

---

## Pydantic Schemas

Skema validasi data yang digunakan pada request dan response API.

### `ItemBase`

Schema dasar yang digunakan sebagai parent oleh `ItemCreate` dan `ItemResponse`.

| Field         | Tipe              | Validasi                          | Contoh                         |
|---------------|-------------------|-----------------------------------|--------------------------------|
| `name`        | `str`             | required, min=1, max=100          | `"Laptop"`                     |
| `description` | `Optional[str]`   | opsional                          | `"Laptop untuk cloud computing"`|
| `price`       | `float`           | required, gt=0                    | `15000000`                     |
| `quantity`    | `int`             | default=0, ge=0                   | `10`                           |

---

### `ItemCreate` (POST Request Body)

Digunakan saat membuat item baru. Mewarisi semua field dari `ItemBase`.

```json
{
  "name": "Laptop Gaming",
  "description": "Laptop untuk kebutuhan cloud computing",
  "price": 15000000,
  "quantity": 10
}
```

---

### `ItemUpdate` (PUT Request Body)

Digunakan saat memperbarui item. Semua field bersifat **opsional** (partial update).

| Field         | Tipe              | Validasi              |
|---------------|-------------------|-----------------------|
| `name`        | `Optional[str]`   | min=1, max=100        |
| `description` | `Optional[str]`   | —                     |
| `price`       | `Optional[float]` | gt=0                  |
| `quantity`    | `Optional[int]`   | ge=0                  |

```json
{
  "price": 14500000,
  "quantity": 8
}
```

---

### `ItemResponse` (Response Body)

Digunakan sebagai output API. Mewarisi `ItemBase` dan menambahkan field dari database.

| Field         | Tipe                  | Keterangan                        |
|---------------|-----------------------|-----------------------------------|
| `id`          | `int`                 | ID unik item di database          |
| `name`        | `str`                 | Nama item                         |
| `description` | `Optional[str]`       | Deskripsi item                    |
| `price`       | `float`               | Harga item                        |
| `quantity`    | `int`                 | Jumlah stok                       |
| `created_at`  | `datetime`            | Waktu item dibuat                 |
| `updated_at`  | `Optional[datetime]`  | Waktu item terakhir diperbarui    |

```json
{
  "id": 1,
  "name": "Laptop Gaming",
  "description": "Laptop untuk kebutuhan cloud computing",
  "price": 15000000,
  "quantity": 10,
  "created_at": "2026-03-12T08:00:00Z",
  "updated_at": null
}
```

---

### `ItemListResponse` (Response Body — List)

Digunakan sebagai output endpoint `GET /items`. Berisi metadata total dan daftar item.

| Field    | Tipe                 | Keterangan                       |
|----------|----------------------|----------------------------------|
| `total`  | `int`                | Total seluruh item di database   |
| `items`  | `list[ItemResponse]` | Daftar item sesuai filter/halaman|

```json
{
  "total": 25,
  "items": [
    {
      "id": 1,
      "name": "Laptop Gaming",
      "description": "Laptop untuk kebutuhan cloud computing",
      "price": 15000000,
      "quantity": 10,
      "created_at": "2026-03-12T08:00:00Z",
      "updated_at": null
    }
  ]
}
```

---

## Relasi Antar Schema

```
ItemBase
  ├── ItemCreate    (digunakan untuk POST /items)
  └── ItemResponse  (digunakan sebagai output response)
        └── ItemListResponse.items[]

ItemUpdate          (digunakan untuk PUT /items/{id}, semua field opsional)
```

---

## Alur Data (Data Flow)

```
Client Request
      │
      ▼
[ Pydantic Schema ]  ← Validasi input (ItemCreate / ItemUpdate)
      │
      ▼
[ CRUD Function ]    ← Operasi SQLAlchemy ORM
      │
      ▼
[ PostgreSQL DB ]    ← Tabel: items
      │
      ▼
[ Pydantic Schema ]  ← Serialisasi output (ItemResponse / ItemListResponse)
      │
      ▼
Client Response
```

---

## Operasi CRUD

| Operasi  | Endpoint              | Fungsi                  | Keterangan                                      |
|----------|-----------------------|-------------------------|-------------------------------------------------|
| CREATE   | `POST /items`         | `create_item()`         | Membuat item baru                               |
| READ ALL | `GET /items`          | `get_items()`           | List items dengan pagination & search           |
| READ ONE | `GET /items/{id}`     | `get_item()`            | Ambil satu item berdasarkan ID                  |
| UPDATE   | `PUT /items/{id}`     | `update_item()`         | Partial update item berdasarkan ID              |
| DELETE   | `DELETE /items/{id}`  | `delete_item()`         | Hapus item berdasarkan ID                       |
| STATS    | `GET /items/stats`    | `get_items_stats()`     | Statistik inventory (total, value, min, max)    |

### Query Parameter `GET /items`

| Parameter | Tipe     | Default | Keterangan                          |
|-----------|----------|---------|-------------------------------------|
| `skip`    | `int`    | `0`     | Offset pagination (ge=0)            |
| `limit`   | `int`    | `20`    | Jumlah data per halaman (1–100)     |
| `search`  | `string` | `null`  | Pencarian pada `name` & `description` (case-insensitive) |

---

## Konfigurasi Koneksi Database

Koneksi database dikonfigurasi melalui environment variable `DATABASE_URL` pada file `.env`.

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
```

Konfigurasi SQLAlchemy:

| Setting       | Nilai   | Keterangan                                 |
|---------------|---------|--------------------------------------------|
| `autocommit`  | `False` | Commit dilakukan secara manual             |
| `autoflush`   | `False` | Flush dilakukan secara manual              |
| Session scope | Per-request | Session dibuka saat request masuk, ditutup saat selesai |
