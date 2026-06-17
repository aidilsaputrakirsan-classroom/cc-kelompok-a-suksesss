"""
Data Migration Script: SafeSpace
Migrasi data dari Monolith Lokal (1 skema) ke Supabase Cloud Microservices (2 skema).
"""
import os
import sys
from sqlalchemy import create_engine, text

# 1. SETUP URL DATABASE
LOCAL_MONOLITH_URL = os.getenv("LOCAL_MONOLITH_URL", "postgresql://postgres:1@localhost:5432/safespace")

# Ganti URL ini dengan Transaction/Session URL dari Supabase-mu
SUPABASE_CLOUD_URL = os.getenv("SUPABASE_CLOUD_URL", "postgresql://postgres:ccsuksesss123@db.ktetsqegdezieyhroegb.supabase.co:5432/postgres")

# 2. PEMETAAN TABEL KE SKEMA MICROSERVICES
MIGRATION_PLAN = {
    "auth_service": [
        "users"
    ],
    "item_service": [
        "school_classes",
        "topics",
        "places",
        "time_slots",
        "students",
        "consultations"
    ]
}

def migrate_table(src_conn, dst_conn, table_name, target_schema):
    print(f"  🔄 Memigrasi tabel '{table_name}' ke skema '{target_schema}'...")
    
    try:
        # Ambil semua data dari tabel monolith lokal
        rows = src_conn.execute(text(f"SELECT * FROM {table_name}")).mappings().fetchall()
        
        if not rows:
            print(f"      ⏩ Tabel kosong. Dilewati.")
            return

        # Ambil daftar nama kolom secara dinamis
        columns = list(rows[0].keys())
        col_names = ", ".join(columns)
        placeholders = ", ".join([f":{col}" for col in columns])
        
        # Susun query INSERT dinamis menuju skema spesifik di Supabase
        insert_query = text(f"""
            INSERT INTO {target_schema}.{table_name} ({col_names})
            VALUES ({placeholders})
            ON CONFLICT (id) DO NOTHING
        """)

        # Eksekusi insert massal
        dst_conn.execute(insert_query, [dict(row) for row in rows])
        dst_conn.commit()
        print(f"      ✅ Sukses memigrasi {len(rows)} baris data.")

    except Exception as e:
        print(f"      ❌ Gagal memigrasi '{table_name}': {e}")
        dst_conn.rollback()

def migrate():
    print("=" * 60)
    print("🚀 DATA MIGRATION: SafeSpace Local → Supabase Cloud")
    print("=" * 60)

    # Buat mesin koneksi
    src_engine = create_engine(LOCAL_MONOLITH_URL)
    dst_engine = create_engine(SUPABASE_CLOUD_URL)

    with src_engine.connect() as src_conn:
        with dst_engine.connect() as dst_conn:
            
            # Eksekusi berdasarkan peta migrasi
            for schema, tables in MIGRATION_PLAN.items():
                print(f"\n📂 Memproses Skema: {schema.upper()}")
                for table_name in tables:
                    migrate_table(src_conn, dst_conn, table_name, schema)

    print("\n" + "=" * 60)
    print("🎉 MIGRATION COMPLETE!")
    print("=" * 60)

if __name__ == "__main__":
    try:
        migrate()
    except Exception as e:
        print(f"\n❌ Migrasi terhenti total: {e}")
        sys.exit(1)