package com.makeup.cadastro_maquiagem.business;

import com.makeup.cadastro_maquiagem.infrastructure.entitys.MarcasMaquiagem;
import com.makeup.cadastro_maquiagem.infrastructure.repository.MarcasRepository;
import org.springframework.stereotype.Service;

@Service
public class MarcasService {
    private final MarcasRepository repository;

    public MarcasService(MarcasRepository repository) {
        this.repository = repository;
    }

    public void salvarMarca(MarcasMaquiagem marca){
        repository.saveAndFlush(marca);
    }

    public MarcasMaquiagem buscarMarcaPorNome(String nome){
        return repository.findByNome(nome).orElseThrow(
                () -> new RuntimeException("Nome não encontrado")
        );
    }

    public void deletarMarcaPorNome(String nome){
        repository.deleteByNome(nome);
    }

    public void atualizarMarcaPorId(Integer id, MarcasMaquiagem marca) {

        MarcasMaquiagem marcaEntity = repository.findById(id).orElseThrow(() ->
                new RuntimeException("Marca não encontrada"));

        MarcasMaquiagem marcaAtualizada = MarcasMaquiagem.builder()
                .nome(marca.getNome() != null ? marca.getNome() :
                        marcaEntity.getNome())
                .id(marcaEntity.getId())
                .build();

        repository.saveAndFlush(marcaAtualizada);
    }
}
