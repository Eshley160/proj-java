package com.makeup.cadastro_maquiagem.infrastructure.entitys;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "MarcasMaquiagem")
@Entity


public class MarcasMaquiagem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name="nome")
    private String nome;

    @Column(name = "ano")
    private Integer ano;

    @Column(name = "pais", length = 100)
    private String pais;

    @Column(name = "cruelty_free")
    private Boolean crueltyFree;
}