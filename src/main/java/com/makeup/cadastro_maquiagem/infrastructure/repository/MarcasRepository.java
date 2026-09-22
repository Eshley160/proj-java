package com.makeup.cadastro_maquiagem.infrastructure.repository;

import com.makeup.cadastro_maquiagem.infrastructure.entitys.MarcasMaquiagem;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MarcasRepository extends JpaRepository<MarcasMaquiagem, Integer> {
    Optional<MarcasMaquiagem> findByNome(String nome);

    @Transactional
    void deleteByNome(String nome);
}
