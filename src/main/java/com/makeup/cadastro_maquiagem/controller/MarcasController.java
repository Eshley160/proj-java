package com.makeup.cadastro_maquiagem.controller;

import com.makeup.cadastro_maquiagem.business.MarcasService;
import com.makeup.cadastro_maquiagem.infrastructure.entitys.MarcasMaquiagem;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/marca")
@RequiredArgsConstructor

public class MarcasController {

    private final MarcasService marcaService;

    @PostMapping
    public ResponseEntity<Void> salvarMarca(@RequestBody MarcasMaquiagem marca){
        marcaService.salvarMarca(marca);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<MarcasMaquiagem> buscarMarcaPorNome(@RequestParam String nome){
        return ResponseEntity.ok(marcaService.buscarMarcaPorNome(nome));
    }

    @DeleteMapping
    public ResponseEntity<Void> deletarMarcaPorNome(@RequestParam String nome){
        marcaService.deletarMarcaPorNome(nome);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<Void> atualizarMarcaPorId(@RequestParam Integer id,
                                                    @RequestBody MarcasMaquiagem marca) {
        marcaService.atualizarMarcaPorId(id, marca);
        return ResponseEntity.ok().build();
    }
}
