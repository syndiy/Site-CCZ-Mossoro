'use client';

import { useState, useEffect } from 'react';
import { 
  listarConteudo, 
  listarDestaques, 
  atualizarOrdemDestaques 
} from '@/lib/api/conteudoApi';
import { ConteudoListResponse, ColecaoConteudo } from '@/lib/types/conteudo';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { AdminPageHeader } from '@/components/admin/admin-page-header';

export default function DestaquesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [destaques, setDestaques] = useState<ConteudoListResponse[]>([]);
  const [disponiveis, setDisponiveis] = useState<ConteudoListResponse[]>([]);
  
  // Estado para controlar o item sendo arrastado
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function carregarDados() {
      try {
        const destaquesAtuais = (await listarDestaques()) as unknown as ConteudoListResponse[];

        const [noticiasRaw, artigosRaw] = await Promise.all([
          listarConteudo('noticias'),
          listarConteudo('artigos'),
        ]);

        if (!isMounted) return;

        const noticias = noticiasRaw.map((n) => ({ ...n, colecao: 'noticias' as ColecaoConteudo }));
        const artigos = artigosRaw.map((a) => ({ ...a, colecao: 'artigos' as ColecaoConteudo }));

        const todos = [...noticias, ...artigos].filter((item) => item.status === "PUBLICADO");
        
        // Casa por slug e tambem por titulo: quando a resposta de destaques nao
        // traz o slug, so o titulo identifica a publicacao, e sem isso ela
        // aparece ao mesmo tempo como destaque e como disponivel.
        const slugsDestaque = new Set(destaquesAtuais.map((d) => d.slug).filter(Boolean));
        const titulosDestaque = new Set(destaquesAtuais.map((d) => d.titulo));
        const naoDestaques = todos.filter(
          (item) => !slugsDestaque.has(item.slug) && !titulosDestaque.has(item.titulo),
        );

        setDestaques(destaquesAtuais);
        setDisponiveis(naoDestaques);
      } catch (err) {
        console.error('Erro ao carregar dados dos destaques:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    carregarDados();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- LÓGICA DE DRAG AND DROP NATIVO ---
  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, targetIndex: number) {
    e.preventDefault(); // Necessário para permitir o drop
    
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const novosDestaques = [...destaques];
    const itemArrastado = novosDestaques[draggedIndex];
    
    // Remove o item da posição original e insere na nova posição
    novosDestaques.splice(draggedIndex, 1);
    novosDestaques.splice(targetIndex, 0, itemArrastado);

    setDraggedIndex(targetIndex);
    setDestaques(novosDestaques);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }
  // ----------------------------------------

  function adicionarAosDestaques(item: ConteudoListResponse) {
    setDestaques((prev) => [...prev, item]);
    setDisponiveis((prev) => prev.filter((i) => i.slug !== item.slug));
  }

  function removerDosDestaques(item: ConteudoListResponse) {
    setDestaques((prev) => prev.filter((i) => i.slug !== item.slug));
    setDisponiveis((prev) => [...prev, item]);
  }

  async function handleSalvarOrdem() {
    try {
      setSaving(true);
      const slugs = destaques.map((item) => item.slug);
      await atualizarOrdemDestaques(slugs);
      toast.success('Destaques salvos. A home já mostra a nova ordem.');
    } catch (err) {
      console.error('Erro ao salvar ordem dos destaques:', err);
      toast.error('Não foi possível salvar os destaques.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-500">
        Carregando destaques e conteúdos...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader secao="Conteúdo do portal" titulo="Destaques da home" descricao="Escolha e ordene as publicações que passam no carrossel do topo da página inicial." />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Destaques Atuais</CardTitle>
            <p className="text-sm text-muted-foreground">
              Arraste os cards para reordenar a exibição na página inicial.
            </p>
          </div>

          <Button
            onClick={handleSalvarOrdem}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar Ordem'}
          </Button>
        </CardHeader>
        <CardContent>
          {destaques.length === 0 ? (
            <p className="text-sm text-gray-500 border border-dashed p-4 rounded-md text-center">
              Nenhum item em destaque. Adicione itens da lista abaixo.
            </p>
          ) : (
            <ul className="space-y-2">
              {destaques.map((item, index) => (
                <li
                  key={item.slug}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-all ${
                    draggedIndex === index ? 'opacity-40 border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 select-none">
                    {/* Ícone Indicador de Arraste */}
                    <div className="text-gray-400 font-mono tracking-tighter text-lg">
                      ⋮⋮
                    </div>
                    <span className="font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{item.titulo}</p>
                      {item.colecao && (
                        <span className="text-xs text-gray-500 uppercase">{item.colecao}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removerDosDestaques(item)}
                  >
                    Remover
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Seção de Conteúdos Disponíveis para Adicionar */}
      <Card>
        <CardHeader>
          <CardTitle>Notícias e Artigos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          {disponiveis.length === 0 ? (
            <p className="text-sm text-gray-500">
              Todos os conteúdos cadastrados já estão nos destaques.
            </p>
          ) : (
            <ul className="space-y-2">
              {disponiveis.map((item) => (
                <li
                  key={item.slug}
                  className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.titulo}</p>
                    {item.colecao && (
                      <span className="text-xs text-gray-500 uppercase">{item.colecao}</span>
                    )}
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => adicionarAosDestaques(item)}
                  >
                    Adicionar
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}