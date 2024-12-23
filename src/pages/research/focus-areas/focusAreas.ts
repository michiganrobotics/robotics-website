// focusAreas.ts
export interface FocusArea {
    title: string;
    description: string;
    icon: string;
    image: string;
    slug: string;
  }
  
  const base = process.env.NODE_ENV === 'production' ? '/rob-astro-23' : '';
  
  export const focusAreas: FocusArea[] = [
    {
      title: "Artificial Intelligence",
      description: "Advanced AI systems for robotic decision making and control",
      icon: "brain",
      image: `${base}/artificial-intelligence.jpg`,
      slug: "artificial-intelligence"
    },
    {
      title: "Autonomous & Connected Vehicles", 
      description: "Research on self-driving vehicles and connected transportation systems",
      icon: "car",
      image: `${base}/autonomous-vehicles.jpg`,
      slug: "autonomous-vehicles"
    },
    {
      title: "Deep Learning for Robotics",
      description: "Neural networks and deep learning applications in robotics",
      icon: "network", 
      image: `${base}/deep-learning.jpg`,
      slug: "deep-learning"
    },
    {
      title: "Human-Robot Interaction",
      description: "Studying and improving how humans and robots work together",
      icon: "users",
      image: `${base}/human-robot.jpg`,
      slug: "human-robot-interaction"
    },
    {
      title: "Legged Robots & Exoskeletons",
      description: "Development of walking robots and wearable robotic systems",
      icon: "robot",
      image: `${base}/legged-robots.jpg`,
      slug: "legged-robots"
    },
    {
      title: "Manufacturing Robotics",
      description: "Robotic systems for advanced manufacturing applications",
      icon: "factory",
      image: `${base}/manufacturing.jpg`,
      slug: "manufacturing"
    },
    {
      title: "Motion Planning",
      description: "Algorithms for robot movement and trajectory optimization",
      icon: "route",
      image: `${base}/motion-planning.jpg`,
      slug: "motion-planning"
    },
    {
      title: "Rehabilitation Robotics",
      description: "Robotic systems for physical therapy and rehabilitation",
      icon: "heart-pulse",
      image: `${base}/rehabilitation.jpg`,
      slug: "rehabilitation"
    },
    {
      title: "Perception & Manipulation",
      description: "Robot sensing, object recognition, and grasping",
      icon: "eye-hand",
      image: `${base}/perception-manipulation.jpg`,
      slug: "perception-manipulation"
    },
    {
      title: "Teams & Swarms",
      description: "Multi-robot coordination and swarm robotics",
      icon: "users-group",
      image: `${base}/teams-swarms.jpg`,
      slug: "teams-swarms"
    },
    {
      title: "SLAM",
      description: "Simultaneous Localization and Mapping for robot navigation",
      icon: "map-pin",
      image: `${base}/slam.jpg`,
      slug: "slam"
    },
    {
      title: "Safe Autonomy",
      description: "Ensuring safety in autonomous robotic systems",
      icon: "shield-check",
      image: `${base}/safe-autonomy.jpg`,
      slug: "safe-autonomy"
    }
  ];