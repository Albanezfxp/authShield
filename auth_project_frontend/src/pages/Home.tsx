import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import {
  CheckCircle,
  Zap,
  BarChart3,
  ArrowRight,
  UserCheck2,
} from "lucide-react";
import Header from "../components/_shared_/Header";
import FeatureCard from "../components/Home/FeatureCard";

export default function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const features = [
    {
      icon: <CheckCircle size={32} />,
      title: "Organização Visual",
      description:
        "Organize suas tarefas em colunas e acompanhe o progresso com facilidade.",
    },
    {
      icon: <Zap size={32} />,
      title: "Produtividade em Foco",
      description:
        "Interface intuitiva que deixa você concentrado no que importa.",
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Acompanhe o Progresso",
      description:
        "Visualize seus avanços com estatísticas claras e objetivas.",
    },
  ];

  return (
    <div className="container">
      <Header />
      <section className="hero">
        <div className="heroContent">
          <div className="heroText">
            <h1 className="title">
              Organize suas tarefas com
              <span className="highlight"> simplicidade</span>
            </h1>
            <p className="subtitle">
              TaskFlow é a forma mais intuitiva de gerenciar suas atividades.
              Visualize seu progresso, colabore com equipes e mantenha tudo sob
              controle.
            </p>
            <div className="heroActions">
              <button className="primaryBtn" onClick={handleLoginClick}>
                Começar Agora
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="socialProof">
              <div className="avatars">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    {" "}
                    <UserCheck2 size={32} />
                  </div>
                ))}
              </div>
              <span>Junte-se a milhares de usuários produtivos</span>
            </div>
          </div>

          <div className="heroVisual">
            <div className="boardPreview">
              <div className="boardHeader">
                <div className="boardTitle">Meu Projeto</div>
                <div className="boardActions">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
              <div className="boardColumns">
                <div className="column">
                  <div className="columnTitle">A fazer</div>
                  <div className="card">Implementar login</div>
                  <div className="card">Criar dashboard</div>
                  <div className="card">Testes de UI</div>
                </div>
                <div className="column">
                  <div className="columnTitle">Em progresso</div>
                  <div className="card">
                    <span className="badge">Design</span>
                    Página inicial
                  </div>
                  <div className="card">API de tarefas</div>
                </div>
                <div className="column">
                  <div className="columnTitle">Concluído</div>
                  <div className="card">
                    <span className="badge">Completo</span>
                    Banco de dados
                  </div>
                  <div className="card">
                    <span className="badge">Completo</span>
                    Autenticação
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="featuresHeader">
          <h2>Tudo que você precisa para ser produtivo</h2>
          <p>Recursos poderosos em uma interface limpa e intuitiva</p>
        </div>

        <div className="featureGrid">
          {features.map((feature, index) => (
            <FeatureCard feature={feature} index={index} />
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="ctaContent">
          <h2>Pronto para aumentar sua produtividade?</h2>
          <p>Comece a usar TaskFlow gratuitamente, sem cartão de crédito</p>
          <div className="createAccountBtnContainer">
            <button className="primaryBtn" onClick={handleLoginClick}>
              Criar Conta
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footerContent">
          <div className="footerSection">
            <div className="footerLogo">
              <div className="logoIcon">T</div>
              <span>TaskFlow</span>
            </div>
            <p>Gerenciamento de tarefas simples e poderoso</p>
          </div>
          <div className="footerLinks">
            <a href="#features">Recursos</a>
            <a href="#pricing">Preços</a>
            <a href="#docs">Documentação</a>
            <a href="#contact">Contato</a>
          </div>
        </div>
        <div className="footerBottom">
          <p>&copy; 2024 TaskFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
