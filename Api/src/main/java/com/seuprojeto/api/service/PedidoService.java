package com.seuprojeto.api.service;
import com.seuprojeto.api.model.Pedido;
import com.seuprojeto.api.model.ItemPedido;
import com.seuprojeto.api.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public String salvarPedido(Pedido pedido) {
        
        if (pedido.getCliente() == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }
        if (pedido.getDataPedido() == null) {
            throw new IllegalArgumentException("Data do pedido é obrigatória.");
        }
        if (pedido.getValorTotal() == null || pedido.getValorTotal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor total deve ser maior que zero.");
        }
        if (pedido.getItens() == null || pedido.getItens().isEmpty()) {
            throw new IllegalArgumentException("O pedido deve conter ao menos um item.");
        }
    
        
        if (pedido.getValorTotal().compareTo(pedido.getCliente().getLimiteCredito()) > 0) {
            throw new IllegalArgumentException("Limite de crédito insuficiente.");
        }
        
        pedido.setDataPedido(LocalDate.now());
        pedido.setStatus("APROVADO");
        
        //estou usando esse for para a fk pedido_id ser corretamente preenchida.
        for (ItemPedido item : pedido.getItens()) {
            item.setPedido(pedido);
        }
        pedidoRepository.save(pedido);
      
        return "Salvo com sucesso";
    }
   
}
