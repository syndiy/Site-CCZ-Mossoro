"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface GlobalConfigData {
  nomeInstituicao: string;
  horarioFuncionamento: string;
  whatsapp: string;
  emailContato: string;
  linkInstagram: string;
  linkFacebook: string;
  linkYoutube: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  localidade: string;
  estado: string; // Alterado de 'uf' para 'estado'
}

const estadoInicial: GlobalConfigData = {
  nomeInstituicao: "",
  horarioFuncionamento: "",
  whatsapp: "",
  emailContato: "",
  linkInstagram: "",
  linkFacebook: "",
  linkYoutube: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cep: "",
  localidade: "",
  estado: "", // Alterado de 'uf' para 'estado'
};

export function GlobalConfigManager() {
  const [formData, setFormData] = useState<GlobalConfigData>(estadoInicial);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  const carregarConfiguracoes = useCallback(async () => {
    setCarregando(true);
    setMensagem(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/configuracaoGlobal", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Falha ao carregar as configurações globais.");

      const data = await res.json();
      setFormData({
        ...data,
        estado: data.estado || data.uf || "", // Compatível caso o backend retorne estado ou uf
      });
    } catch (err) {
      setMensagem({
        tipo: "erro",
        texto: err instanceof Error ? err.message : "Erro desconhecido ao carregar.",
      });
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarConfiguracoes();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [carregarConfiguracoes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem(null);

    // Ajustes para o Enum Java:
    // 1. Converte para maiúsculas (ex: "rn" -> "RN")
    // 2. Se o campo estiver vazio (""), envia null para não quebrar a conversão de Enum do Spring
    const payload = {
      ...formData,
      estado: formData.estado && formData.estado.trim() !== "" 
        ? formData.estado.trim().toUpperCase() 
        : null,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/configuracaoGlobal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.message || "Erro ao salvar as configurações. Verifique as validações do servidor."
        );
      }

      const data = await res.json();
      setFormData({
        ...data,
        estado: data.estado || data.uf || "",
      });
      setMensagem({ tipo: "sucesso", texto: "Configurações atualizadas com sucesso!" });
      
      setTimeout(() => setMensagem(null), 3000);
    } catch (err) {
      setMensagem({
        tipo: "erro",
        texto: err instanceof Error ? err.message : "Erro ao salvar alterações.",
      });
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground animate-in fade-in">
        Carregando configurações do sistema...
      </div>
    );
  }

  return (
    <Card className="shadow-sm animate-in fade-in duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Configurações do Sistema</CardTitle>
        <CardDescription>
          Gerencie as informações de contato, redes sociais e endereço exibidas no portal institucional.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mensagem && (
          <div className={`p-3 mb-4 text-sm rounded-md border ${mensagem.tipo === "sucesso" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSalvar} className="space-y-8">
          {/* Seção 1: Identidade e Contato */}
          <div>
            <h3 className="text-sm font-bold border-b pb-2 mb-4">Identidade e Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Nome da Instituição</label>
                <input type="text" name="nomeInstituicao" value={formData.nomeInstituicao || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Horário de Funcionamento</label>
                <input type="text" name="horarioFuncionamento" value={formData.horarioFuncionamento || ""} onChange={handleChange} placeholder="Ex: Seg a Sex, das 08h às 17h" className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">WhatsApp</label>
                <input type="text" name="whatsapp" value={formData.whatsapp || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">E-mail de Contato</label>
                <input type="email" name="emailContato" value={formData.emailContato || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Link do Instagram</label>
                <input type="url" name="linkInstagram" value={formData.linkInstagram || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Link do Facebook</label>
                <input type="url" name="linkFacebook" value={formData.linkFacebook || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold block mb-1">Link do YouTube</label>
                <input type="url" name="linkYoutube" value={formData.linkYoutube || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          </div>

          {/* Seção 2: Endereço */}
          <div>
            <h3 className="text-sm font-bold border-b pb-2 mb-4">Endereço (Sede)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-xs font-semibold block mb-1">CEP</label>
                <input type="text" name="cep" value={formData.cep || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold block mb-1">Logradouro (Rua, Av.)</label>
                <input type="text" name="logradouro" value={formData.logradouro || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-semibold block mb-1">Número</label>
                <input type="text" name="numero" value={formData.numero || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold block mb-1">Complemento</label>
                <input type="text" name="complemento" value={formData.complemento || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-semibold block mb-1">Bairro</label>
                <input type="text" name="bairro" value={formData.bairro || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-semibold block mb-1">Cidade (Localidade)</label>
                <input type="text" name="localidade" value={formData.localidade || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-semibold block mb-1">Estado (UF)</label>
                <input type="text" name="estado" maxLength={2} value={formData.estado || ""} onChange={handleChange} className="w-full text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary uppercase" placeholder="Ex: RN" />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button type="submit" disabled={salvando} className="w-full md:w-auto">
              {salvando ? "Salvando alterações..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}