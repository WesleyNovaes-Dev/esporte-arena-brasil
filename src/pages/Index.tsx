
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Trophy, MapPin, Star } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Eventos Esportivos',
      description: 'Crie e participe de partidas, treinos e campeonatos em sua região',
    },
    {
      icon: Users,
      title: 'Gestão de Times',
      description: 'Monte seu time, convide jogadores e gerencie seu elenco',
    },
    {
      icon: Trophy,
      title: 'Campeonatos',
      description: 'Organize torneios completos com fases eliminatórias e pontos corridos',
    },
    {
      icon: MapPin,
      title: 'Localização',
      description: 'Encontre eventos próximos a você com integração GPS',
    },
    {
      icon: Star,
      title: 'Rankings',
      description: 'Acompanhe suas estatísticas e avaliações de performance',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">AE</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Agenda Esporte
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              A plataforma completa para organizar eventos esportivos, gerenciar times e 
              acompanhar sua evolução no esporte. Conecte-se com atletas da sua região!
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="bg-white text-green-600 hover:bg-gray-100">
                <Link to="/register">Começar Agora 2222</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-green-600">
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating cards decoration */}
        <div className="absolute top-20 left-10 transform rotate-12 opacity-20">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="absolute bottom-20 right-10 transform -rotate-12 opacity-20">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
            <Trophy className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para o esporte
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa que conecta atletas, organizadores e times 
              em um só lugar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para revolucionar seu esporte?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a milhares de atletas que já estão usando a Agenda Esporte
          </p>
          <Button size="lg" asChild className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
            <Link to="/register">Cadastre-se Gratuitamente</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
