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
}
