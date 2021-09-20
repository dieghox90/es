export class FileItem {


  id: number;
  archivo: File;
   nombreArchivo: string;
   url: string;
   estaSubiendo:boolean;
   progreso: number;
  imgPreview: string | ArrayBuffer;
  elimina: boolean;

  constructor(archivo: File) {
    this.archivo = archivo;
    this.nombreArchivo = archivo.name;
    this.estaSubiendo = false;
    this.progreso = 0;
    this.imgPreview = "";
    this.elimina = false;
  
  
  }


}
