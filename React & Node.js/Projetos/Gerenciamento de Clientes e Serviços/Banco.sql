CREATE TABLE aluno (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(255) NOT NULL,
  fone varchar(11) NOT NULL,
  email varchar(255) DEFAULT NULL,
  endereco varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
);

CREATE TABLE servico (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(255) NOT NULL,
  preco varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE aluno_servico (
  id int NOT NULL AUTO_INCREMENT,
  id_aluno int DEFAULT NULL,
  id_servico int DEFAULT NULL,
  data_inicio datetime DEFAULT CURRENT_TIMESTAMP,
  data_vencimento date DEFAULT NULL,
  PRIMARY KEY (id),
  KEY id_aluno (id_aluno),
  KEY id_servico (id_servico),
  CONSTRAINT aluno_servico_ibfk_1 FOREIGN KEY (id_aluno) REFERENCES aluno (id) ON DELETE CASCADE,
  CONSTRAINT aluno_servico_ibfk_2 FOREIGN KEY (id_servico) REFERENCES servico (id) ON DELETE CASCADE
);

CREATE TABLE pagamento (
  id int NOT NULL AUTO_INCREMENT,
  id_aluno int DEFAULT NULL,
  id_servico int DEFAULT NULL,
  data_pagamento date DEFAULT NULL,
  PRIMARY KEY (id),
  KEY id_aluno (id_aluno),
  KEY id_servico (id_servico),
  CONSTRAINT pagamento_ibfk_1 FOREIGN KEY (id_aluno) REFERENCES aluno_servico (id_aluno) ON DELETE CASCADE,
  CONSTRAINT pagamento_ibfk_2 FOREIGN KEY (id_servico) REFERENCES aluno_servico (id_servico) ON DELETE CASCADE
);

DELIMITER ;;
CREATE TRIGGER atualizar_data_vencimento BEFORE INSERT ON aluno_servico FOR EACH ROW 
BEGIN
    SET NEW.data_vencimento = DATE_ADD(NEW.data_inicio, INTERVAL 1 MONTH);
END ;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE atualizar_pagamento_e_vinculo(
    IN aluno_id INT,
    IN servico_id INT
)
BEGIN
    UPDATE Aluno_Servico
    SET data_vencimento = DATE_ADD(data_vencimento, INTERVAL 1 MONTH)
    WHERE id_aluno = aluno_id AND id_servico = servico_id;

    INSERT INTO Pagamento (id_aluno, id_servico, data_pagamento)
    VALUES (aluno_id, servico_id, CURRENT_DATE);
END ;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE relatorio_pagamento_dia()
BEGIN
    SELECT 
        Pagamento.id, 
        Aluno.nome AS aluno_nome, 
        Servico.nome AS servico_nome, 
        Pagamento.data_pagamento,
        Servico.preco AS valor_pago
    FROM Pagamento
    JOIN Aluno_Servico ON Pagamento.id_aluno = Aluno_Servico.id_aluno 
                      AND Pagamento.id_servico = Aluno_Servico.id_servico
    JOIN Aluno ON Aluno_Servico.id_aluno = Aluno.id
    JOIN Servico ON Aluno_Servico.id_servico = Servico.id
    WHERE Pagamento.data_pagamento = CURRENT_DATE;

    SELECT SUM(CAST(Servico.preco AS DECIMAL(10, 2))) AS total_pago
    FROM Pagamento
    JOIN Aluno_Servico ON Pagamento.id_aluno = Aluno_Servico.id_aluno 
                      AND Pagamento.id_servico = Aluno_Servico.id_servico
    JOIN Servico ON Aluno_Servico.id_servico = Servico.id
    WHERE Pagamento.data_pagamento = CURRENT_DATE;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE relatorio_pagamento_semana()
BEGIN
    SELECT 
        Pagamento.id, 
        Aluno.nome AS aluno_nome, 
        Servico.nome AS servico_nome, 
        Pagamento.data_pagamento,
        Servico.preco AS valor_pago
    FROM Pagamento
    JOIN Aluno_Servico ON Pagamento.id_aluno = Aluno_Servico.id_aluno 
                      AND Pagamento.id_servico = Aluno_Servico.id_servico
    JOIN Aluno ON Aluno_Servico.id_aluno = Aluno.id
    JOIN Servico ON Aluno_Servico.id_servico = Servico.id
    WHERE Pagamento.data_pagamento >= CURDATE() - INTERVAL 7 DAY;

    SELECT SUM(CAST(Servico.preco AS DECIMAL(10, 2))) AS total_pago
    FROM Pagamento
    JOIN Aluno_Servico ON Pagamento.id_aluno = Aluno_Servico.id_aluno 
                      AND Pagamento.id_servico = Aluno_Servico.id_servico
    JOIN Servico ON Aluno_Servico.id_servico = Servico.id
    WHERE Pagamento.data_pagamento >= CURDATE() - INTERVAL 7 DAY;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE relatorio_pagamento_mes()
BEGIN
    SELECT 
        Pagamento.id, 
        Aluno.nome AS aluno_nome, 
        Servico.nome AS servico_nome, 
        Pagamento.data_pagamento,
        Servico.preco AS valor_pago
    FROM Pagamento
    JOIN Aluno_Servico ON Pagamento.id_aluno = Aluno_Servico.id_aluno 
                      AND Pagamento.id_servico = Aluno_Servico.id_servico
    JOIN Aluno ON Aluno_Servico.id_aluno = Aluno.id
    JOIN Servico ON Aluno_Servico.id_servico = Servico.id
    WHERE Pagamento.data_pagamento >= CURDATE() - INTERVAL 30 DAY;

    SELECT SUM(CAST(Servico.preco AS DECIMAL(10, 2))) AS total_pago
    FROM Pagamento
    JOIN Aluno_Servico ON Pagamento.id_aluno = Aluno_Servico.id_aluno 
                      AND Pagamento.id_servico = Aluno_Servico.id_servico
    JOIN Servico ON Aluno_Servico.id_servico = Servico.id
    WHERE Pagamento.data_pagamento >= CURDATE() - INTERVAL 30 DAY;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE vincular_servico_aluno(
    IN nome_aluno VARCHAR(255),
    IN nome_servico VARCHAR(255)
)
BEGIN
    DECLARE id_aluno INT;
    DECLARE id_servico INT;

    SELECT id INTO id_aluno FROM Aluno WHERE nome = nome_aluno LIMIT 1;
    SELECT id INTO id_servico FROM Servico WHERE nome = nome_servico LIMIT 1;

    IF id_aluno IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Aluno não encontrado';
    END IF;

    IF id_servico IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Serviço não encontrado';
    END IF;

    INSERT INTO Aluno_Servico (id_aluno, id_servico) 
    VALUES (id_aluno, id_servico);
END ;;
DELIMITER ;

CREATE VIEW alunoservicoview AS 
SELECT aluno_servico.id AS id, aluno.nome AS aluno, servico.nome AS servico,
aluno_servico.data_inicio AS data_inicio, aluno_servico.data_vencimento AS data_vencimento 
FROM ((aluno_servico JOIN aluno ON (aluno_servico.id_aluno = aluno.id)) 
JOIN servico ON (aluno_servico.id_servico = servico.id));

CREATE VIEW alunosporservico AS 
SELECT aluno_servico.id AS aluno_servico_id, aluno.id AS id, aluno.nome AS nome,
aluno.fone AS fone, aluno.email AS email, aluno.endereco AS endereco,
servico.nome AS servico_nome 
FROM ((aluno_servico JOIN aluno ON (aluno_servico.id_aluno = aluno.id)) 
JOIN servico ON (aluno_servico.id_servico = servico.id));

CREATE VIEW pagamentosview AS 
SELECT pagamento.id AS id, aluno.nome AS aluno_nome, servico.nome AS servico_nome,
pagamento.data_pagamento AS data_pagamento 
FROM (((pagamento JOIN aluno_servico ON ((pagamento.id_aluno = aluno_servico.id_aluno) 
AND (pagamento.id_servico = aluno_servico.id_servico))) 
JOIN aluno ON (aluno_servico.id_aluno = aluno.id)) 
JOIN servico ON (aluno_servico.id_servico = servico.id));

SELECT * FROM servico;