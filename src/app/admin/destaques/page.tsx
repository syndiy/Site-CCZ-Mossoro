"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GripVertical } from "lucide-react"; 

import { listarDestaques, atualizarOrdemDestaques } from "@/lib/api/conteudoApi";
import type { DestaqueItem } from "@/lib/types/conteudo";

export default function DestaquesPage() {
  const [itens, setItens] = useState<DestaqueItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  // Busca inicial dos dados reais do backend
  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarDestaques();
        // Garante que a lista comece ordenada pelo campo 'ordem' vindo do banco
        const ordenados = dados.sort((a, b) => a.ordem - b.ordem);
        setItens(ordenados);
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao carregar destaques.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  // Função disparada quando o usuário solta o card
  const handleDragEnd = (result: DropResult) => {
    // Se soltou fora da lista, ignora
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    // Se soltou no mesmo lugar, ignora
    if (startIndex === endIndex) return;

    // Reordena o array localmente
    const novaLista = Array.from(itens);
    const [itemArrastado] = novaLista.splice(startIndex, 1);
    novaLista.splice(endIndex, 0, itemArrastado);

    // Atualiza a propriedade 'ordem' de todos os itens com base na nova posição
    const listaAtualizada = novaLista.map((item, index) => ({
      ...item,
      ordem: index + 1,
    }));

    setItens(listaAtualizada);
    setSucesso(false);
  };

 const handleSalvarOrdem = async () => {
    setSalvando(true);
    setErro("");
    setSucesso(false);

    try {
      const novaOrdemSlugs = itens.map((item) => String(item.id));
      
      await atualizarOrdemDestaques(novaOrdemSlugs);
      
      setSucesso(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar a nova ordem.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <div>
          <CardTitle className="text-xl font-bold">Destaques da Home</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Arraste os itens para alterar a ordem de exibição na página inicial.
          </p>
        </div>
        <Button onClick={handleSalvarOrdem} disabled={salvando || carregando}>
          {salvando ? "Salvando..." : "Salvar Ordem"}
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        {erro && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}
        
        {sucesso && (
          <Alert className="mb-4 bg-emerald-50 text-emerald-800 border-emerald-200">
            <AlertDescription>Ordem atualizada com sucesso!</AlertDescription>
          </Alert>
        )}

        {carregando ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Carregando destaques...
          </div>
        ) : itens.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Nenhum destaque configurado no momento.
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="destaques-lista">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-3"
                >
                  {itens.map((item, index) => (
                    <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center gap-3 p-3 rounded-lg border bg-background transition-shadow ${
                            snapshot.isDragging ? "shadow-lg ring-1 ring-primary/20" : ""
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab hover:text-primary p-1 text-muted-foreground active:cursor-grabbing"
                          >
                            <GripVertical size={20} />
                          </div>
                          
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{item.titulo}</span>
                            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                              {item.tipo}
                            </span>
                          </div>
                          
                          <div className="ml-auto text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                            Pos: {index + 1}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </CardContent>
    </Card>
  );
}