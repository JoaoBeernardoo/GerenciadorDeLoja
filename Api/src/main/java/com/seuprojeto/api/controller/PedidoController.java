package com.seuprojeto.api.controller;
import org.springframework.http.ResponseEntity;
import com.seuprojeto.api.model.Pedido;
import com.seuprojeto.api.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/pedido")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;
    
    @PostMapping
    public ResponseEntity<String> salvarPedido(@RequestBody Pedido pedido) {
        try {
            String resposta = pedidoService.salvarPedido(pedido);
            return ResponseEntity.ok(resposta); 
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); 
        }
    }
    
}
