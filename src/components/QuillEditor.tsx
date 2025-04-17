import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Quill editör için ref tipini tanımlıyoruz
export interface QuillEditorRef {
  getEditor: () => Quill | null;
}

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  modules: any;
  formats: string[];
  placeholder?: string;
  style?: React.CSSProperties;
  onPaste?: (e: React.ClipboardEvent) => void;
}

// forwardRef kullanarak ref'i doğrudan DOM elemanına geçiriyoruz
const QuillEditor = forwardRef<QuillEditorRef, QuillEditorProps>((props, ref) => {
  const { value, onChange, modules, formats, placeholder, style, onPaste } = props;
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<Quill | null>(null);
  const isInitializedRef = useRef(false);

  // useImperativeHandle ile dışarıya açacağımız metotları tanımlıyoruz
  useImperativeHandle(ref, () => ({
    getEditor: () => quillInstanceRef.current,
  }));

  // Quill editörünü başlatma
  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current) {
      // Quill editörünü oluştur
      const quill = new Quill(editorRef.current, {
        modules: modules,
        formats: formats,
        placeholder: placeholder,
        theme: 'snow',
      });

      // İçeriği ayarla
      quill.root.innerHTML = value;

      // Değişiklik olayını dinle
      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        if (html === '<p><br></p>') {
          // Boş içerik durumunda
          onChange('');
        } else {
          onChange(html);
        }
      });

      // Quill instance'ını kaydet
      quillInstanceRef.current = quill;
      isInitializedRef.current = true;
    }
  }, []);

  // İçerik değiştiğinde Quill içeriğini güncelle
  useEffect(() => {
    if (quillInstanceRef.current && quillInstanceRef.current.root.innerHTML !== value) {
      quillInstanceRef.current.root.innerHTML = value;
    }
  }, [value]);

  // Modüller değiştiğinde Quill modüllerini güncelle
  useEffect(() => {
    if (quillInstanceRef.current && modules) {
      Object.keys(modules).forEach((key) => {
        if (key === 'toolbar' && modules.toolbar.handlers) {
          // Toolbar işleyicilerini güncelle
          Object.keys(modules.toolbar.handlers).forEach((handlerKey) => {
            quillInstanceRef.current?.getModule('toolbar').addHandler(handlerKey, modules.toolbar.handlers[handlerKey]);
          });
        }
      });
    }
  }, [modules]);

  return (
    <div style={{ width: '100%', ...style }}>
      <div 
        ref={editorRef} 
        onPaste={onPaste}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;
