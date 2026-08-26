"use client";

import { useState } from "react";
import { tiposDenuncia, statusDenuncia } from "@/lib/content";
import {
  criarDenuncia,
  buscarDenuncia,
  type Denuncia,
  type DenunciaDetalhe,
  type TipoDenuncia,
} from "@/lib/api";
import {
  buscarPorCep,
  coordenadasDoEndereco,
  enderecoDasCoordenadas,
  formatarCep,
  type Coords,
} from "@/lib/geocode";
import { comprimirImagem } from "@/lib/image";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "@/components/maps/map";
import { Icon } from "@/components/shared/icon";

const cczCoords: Coords = { lat: site.address.lat, lng: site.address.lng };

type Errors = Partial<Record<"tipo" | "logradouro" | "localidade" | "uf" | "imagem", string>>;

function Step({ number, title }: { number: number; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {number}
      </span>
      <h3 className="text-lg font-semibold text-brand-900">{title}</h3>
    </div>
  );
}

function FieldError({ children }: { children: string }) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-destructive">
      <Icon name="report" size={15} /> {children}
    </p>
  );
}

export function ReportForm() {
  const [tipo, setTipo] = useState<TipoDenuncia | "">("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [localidade, setLocalidade] = useState<string>(site.address.city);
  const [uf, setUf] = useState<string>(site.address.state);
  const [imagem, setImagem] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [ponto, setPonto] = useState<Coords | null>(null);
  const [aviso, setAviso] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");
  const [resultado, setResultado] = useState<Denuncia | null>(null);

  function preencher(dados: Partial<Record<string, string>>) {
    if (dados.cep) setCep(dados.cep);
    if (dados.logradouro) setLogradouro(dados.logradouro);
    if (dados.numero) setNumero(dados.numero);
    if (dados.bairro) setBairro(dados.bairro);
    if (dados.localidade) setLocalidade(dados.localidade);
    if (dados.uf) setUf(dados.uf);
  }

  async function onCepBlur() {
    const digitos = cep.replace(/\D/g, "");
    if (digitos.length !== 8) return;
    setAviso("Buscando o endereço pelo CEP…");
    const encontrado = await buscarPorCep(digitos);
    if (!encontrado) {
      setAviso("CEP não encontrado. Preencha o endereço ou toque no mapa.");
      return;
    }
    preencher(encontrado);
    setAviso("Endereço preenchido pelo CEP. Toque no mapa para marcar o ponto exato.");
    const consulta = [encontrado.logradouro, encontrado.bairro, encontrado.localidade, encontrado.uf]
      .filter(Boolean)
      .join(", ");
    const coords = await coordenadasDoEndereco(consulta);
    if (coords) setPonto(coords);
  }

  async function marcarNoMapa(p: Coords) {
    setPonto(p);
    setAviso("Buscando o endereço do ponto marcado…");
    const encontrado = await enderecoDasCoordenadas(p);
    if (encontrado) {
      preencher(encontrado);
      setAviso("Ponto marcado. Confira o endereço e ajuste o número, se precisar.");
    } else {
      setAviso("Ponto marcado no mapa. Preencha o endereço manualmente.");
    }
  }

  function usarMinhaLocalizacao() {
    if (!navigator.geolocation) {
      setAviso("Geolocalização não disponível neste navegador.");
      return;
    }
    setAviso("Obtendo a sua localização…");
    navigator.geolocation.getCurrentPosition(
      (pos) => marcarNoMapa({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setAviso("Não foi possível obter a localização. Toque no mapa ou digite o CEP."),
    );
  }

  async function onImagem(file: File | null) {
    if (!file) {
      setImagem(null);
      setPreview("");
      return;
    }
    const comprimida = await comprimirImagem(file);
    setImagem(comprimida);
    setPreview(URL.createObjectURL(comprimida));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroEnvio("");

    const next: Errors = {};
    if (!tipo) next.tipo = "Selecione o tipo de denúncia.";
    if (!logradouro.trim()) next.logradouro = "Informe a rua.";
    if (!localidade.trim()) next.localidade = "Informe a cidade.";
    if (!uf.trim()) next.uf = "Informe a UF.";
    if (!imagem) next.imagem = "Anexe uma foto da ocorrência.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setEnviando(true);
    try {
      const res = await criarDenuncia({
        tipoDeDenuncia: tipo as TipoDenuncia,
        nomeDenunciante: nome.trim(),
        numeroTelefone: telefone.trim(),
        cep: cep.trim(),
        logradouro: logradouro.trim(),
        numero: numero.trim(),
        complemento: complemento.trim(),
        bairro: bairro.trim(),
        localidade: localidade.trim(),
        uf: uf.trim().toUpperCase(),
        imagem,
      });
      setResultado(res);
    } catch (err) {
      setErroEnvio(
        err instanceof Error ? err.message : "Erro inesperado ao enviar. Tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  if (resultado) {
    return (
      <Card className="rounded-2xl text-center shadow-card">
        <CardContent className="py-12">
          <span className="mb-5 inline-flex size-16 items-center justify-center rounded-full bg-success-50 text-success-600">
            <Icon name="check" size={36} />
          </span>
          <h2 className="text-2xl font-bold">Denúncia registrada!</h2>
          <p className="mt-2 text-muted-foreground">Guarde o número para acompanhar:</p>
          <p className="my-5 text-4xl font-bold tracking-wide text-success-600">#{resultado.id}</p>
          <p className="mx-auto mb-7 max-w-md text-muted-foreground">
            Nossa equipe vai analisar a ocorrência. Se você informou um telefone, poderá receber um
            retorno.
          </p>
          <Button variant="outline" onClick={() => setResultado(null)}>
            Registrar outra denúncia
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-card">
      <CardHeader>
        <CardTitle className="text-xl">Formulário de denúncia</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
          <section>
            <Step number={1} title="O que você quer denunciar" />
            <div role="radiogroup" aria-label="Tipo de denúncia" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {tiposDenuncia.map((t) => {
                const ativo = tipo === t.value;
                return (
                  <button
                    type="button"
                    key={t.value}
                    role="radio"
                    aria-checked={ativo}
                    onClick={() => setTipo(t.value)}
                    className={cn(
                      "flex min-h-16 items-center rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                      ativo
                        ? "border-brand-600 bg-info-50 text-brand-800 shadow-sm ring-1 ring-brand-600"
                        : "border-border bg-white text-ink-soft hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-soft",
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            {errors.tipo ? <FieldError>{errors.tipo}</FieldError> : null}
          </section>

          <section className="border-t border-border pt-8">
            <Step number={2} title="Onde fica" />

            <Map
              center={ponto ?? cczCoords}
              marker={ponto}
              zoom={ponto ? 17 : 13}
              onPick={marcarNoMapa}
              className="h-72 w-full"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button type="button" variant="outline" onClick={usarMinhaLocalizacao}>
                <Icon name="gps" size={18} /> Usar minha localização
              </Button>
              <span className="text-sm text-muted-foreground">
                Toque no mapa para marcar o local exato. Arraste o pino para ajustar.
              </span>
            </div>
            {aviso ? <p className="mt-2 text-sm text-muted-foreground">{aviso}</p> : null}

            <div className="mt-5 grid gap-5 sm:grid-cols-6">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  inputMode="numeric"
                  value={cep}
                  onChange={(e) => setCep(formatarCep(e.target.value))}
                  onBlur={onCepBlur}
                  placeholder="59600-000"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-4">
                <Label htmlFor="logradouro">
                  Rua <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="logradouro"
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                  placeholder="Ex.: Rua das Flores"
                  aria-invalid={!!errors.logradouro}
                />
                {errors.logradouro ? <FieldError>{errors.logradouro}</FieldError> : null}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="123"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-4">
                <Label htmlFor="complemento">Complemento ou referência</Label>
                <Input
                  id="complemento"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  placeholder="Ex.: perto do mercado"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-3">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="localidade">
                  Cidade <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="localidade"
                  value={localidade}
                  onChange={(e) => setLocalidade(e.target.value)}
                  aria-invalid={!!errors.localidade}
                />
                {errors.localidade ? <FieldError>{errors.localidade}</FieldError> : null}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-1">
                <Label htmlFor="uf">
                  UF <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="uf"
                  maxLength={2}
                  value={uf}
                  onChange={(e) => setUf(e.target.value.toUpperCase())}
                  aria-invalid={!!errors.uf}
                />
                {errors.uf ? <FieldError>{errors.uf}</FieldError> : null}
              </div>
            </div>
          </section>

          <section className="border-t border-border pt-8">
            <Step number={3} title="Foto da ocorrência" />
            <Label
              htmlFor="imagem"
              className={cn(
                "group flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed p-5 text-center text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-accent",
                errors.imagem ? "border-destructive" : "border-border",
              )}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Pré-visualização da foto"
                    className="max-h-48 rounded-lg object-contain shadow-sm"
                  />
                  <span className="font-medium text-brand-800">{imagem?.name} · clique para trocar</span>
                </>
              ) : (
                <>
                  <Icon
                    name="upload"
                    size={28}
                    className="text-primary transition-transform duration-300 group-hover:scale-110"
                  />
                  <span>
                    <strong className="text-brand-800">Clique para anexar</strong> uma foto da
                    ocorrência <span className="text-destructive">*</span>
                  </span>
                </>
              )}
            </Label>
            <Input
              id="imagem"
              type="file"
              accept="image/*"
              className="sr-only"
              aria-invalid={!!errors.imagem}
              onChange={(e) => onImagem(e.target.files?.[0] ?? null)}
            />
            {errors.imagem ? <FieldError>{errors.imagem}</FieldError> : null}
          </section>

          <section className="border-t border-border pt-8">
            <Step number={4} title="Contato para retorno (opcional)" />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nome">Seu nome</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="telefone">Telefone ou WhatsApp</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>
            </div>
          </section>

          {erroEnvio ? (
            <Alert variant="destructive">
              <AlertDescription>{erroEnvio}</AlertDescription>
            </Alert>
          ) : null}

          <Button type="submit" size="lg" disabled={enviando} className="w-full">
            {enviando ? "Enviando…" : "Enviar denúncia"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function ProtocolLookup() {
  const [id, setId] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<DenunciaDetalhe | null>(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  async function consultar(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim()) return;
    setCarregando(true);
    setResultado(null);
    setNaoEncontrado(false);
    try {
      const res = await buscarDenuncia(id.trim());
      if (res) setResultado(res);
      else setNaoEncontrado(true);
    } catch {
      setNaoEncontrado(true);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Card className="mt-6 rounded-2xl shadow-card">
      <CardContent className="py-8 text-center">
        <h2 className="text-2xl font-bold">Acompanhar uma denúncia</h2>
        <p className="mx-auto mb-5 mt-2 max-w-md text-muted-foreground">
          Digite o número que você recebeu ao registrar.
        </p>

        <form onSubmit={consultar} className="flex flex-wrap justify-center gap-3">
          <Label htmlFor="id" className="sr-only">
            Número da denúncia
          </Label>
          <Input
            id="id"
            inputMode="numeric"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Ex.: 1234"
            className="max-w-56"
          />
          <Button type="submit" variant="outline" disabled={carregando}>
            {carregando ? "Consultando…" : "Consultar"}
          </Button>
        </form>

        {resultado ? (
          <p className="mt-5 inline-flex flex-wrap items-center justify-center gap-2">
            Denúncia <strong>#{resultado.id ?? resultado.idDenuncia}</strong>
            <Badge className={statusDenuncia[resultado.statusDenuncia].className}>
              <Icon name={statusDenuncia[resultado.statusDenuncia].icon} size={14} />
              {statusDenuncia[resultado.statusDenuncia].label}
            </Badge>
          </p>
        ) : null}

        {naoEncontrado ? (
          <p className="mt-5 text-muted-foreground">Nenhuma denúncia encontrada com esse número.</p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
          Status possíveis:
          {Object.values(statusDenuncia).map((s) => (
            <Badge key={s.label} variant="secondary">
              <Icon name={s.icon} size={14} />
              {s.label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
