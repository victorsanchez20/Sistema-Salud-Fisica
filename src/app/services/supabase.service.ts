import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {

  private supabase: SupabaseClient;
  readonly bucketStorage = 'historias-clinicas';

  constructor() {
    this.supabase = createClient(
      'https://dvjkxquflyyzfptlnpwx.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2amt4cXVmbHl5emZwdGxucHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0OTI0MDUsImV4cCI6MjA5MDA2ODQwNX0.fsQYlwVA5VyTYE3Eo9Q3jaDgi8_7K7LQOIfWRnAdjQo'
    )
  }
  
  async subirArchivo(file: File, pacienteId: number): Promise<string> {
    const extension = file.name.split('.').pop();
    const nombreArchivo = `paciente_${pacienteId}/${Date.now()}.${extension}`;

    const { error } = await this.supabase.storage
      .from(this.bucketStorage) //nombre del bucket
      .upload(nombreArchivo, file, {
        contentType: file.type,
        upsert: false
      }) ;

      if (error) throw error;

      // Get public url
      const { data: urlData } = this.supabase.storage
        .from(this.bucketStorage)
        .getPublicUrl(nombreArchivo);
      
      return urlData.publicUrl;
  }

  async listarArchivos(pacienteId: number) {
    const {data, error } = await this.supabase.storage
      .from(this.bucketStorage)
      .list(`paciente_${pacienteId}`);
      
    if (error) throw error;
    return data;
  }

  async eliminarArchivo(url: string): Promise<void> {
    // Extraer la ruta del archivo desde la URL publica
    // URL tipica: https://dvjkxquflyyzfptlnpwx.supabase.co/storage/v1/object/public/historias-clinicas/paciente_123/1234567890.pdf
    const baseUrl = `https://dvjkxquflyyzfptlnpwx.supabase.co/storage/v1/object/public/${this.bucketStorage}/`;
    const filePath = url.replace(baseUrl, '');

    if (filePath && filePath !== url) {
      const { error } = await this.supabase.storage
        .from(this.bucketStorage)
        .remove([filePath]);

      if (error) throw error;
    }
  }
  
}
