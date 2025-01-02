// focusAreas.ts
export interface FocusArea {
    title: string;
    description: string;
    icon: string;
    image: string;
    imageAlt: string;
    slug: string;
  }
  
  const base = process.env.NODE_ENV === 'production' ? '/rob-astro-23' : '';
  
  export const focusAreas: FocusArea[] = [
    {
      title: "Artificial Intelligence",
      description: "Advanced AI systems for robotic decision making and control",
      icon: "brain",
      image: `/src/images/focus-areas/artificial-intelligence.jpg`,
      imageAlt: "Artificial Intelligence research visualization",
      slug: "artificial-intelligence"
    },
    {
      title: "Autonomous & Connected Vehicles", 
      description: "Research on self-driving vehicles and connected transportation systems",
      icon: "car",
      image: `/src/images/focus-areas/autonomous-vehicles.jpg`,
      imageAlt: "Autonomous & Connected Vehicles research visualization",
      slug: "autonomous-vehicles"
    },
    {
      title: "Deep Learning for Robotics",
      description: "Neural networks and deep learning applications in robotics",
      icon: "network", 
      image: `/src/images/focus-areas/deep-learning.jpg`,
      imageAlt: "Deep Learning for Robotics research visualization",
      slug: "deep-learning"
    },
    {
      title: "Human-Robot Interaction",
      description: "Studying and improving how humans and robots work together",
      icon: "users",
      image: `/src/images/focus-areas/human-robot.jpg`,
      imageAlt: "Human-Robot Interaction research visualization",
      slug: "human-robot-interaction"
    },
    {
      title: "Legged Robots & Exoskeletons",
      description: "Development of walking robots and wearable robotic systems",
      icon: "robot",
      image: `/src/images/focus-areas/legged-robots.jpg`,
      imageAlt: "Legged Robots & Exoskeletons research visualization",
      slug: "legged-robots"
    },
    {
      title: "Manufacturing Robotics",
      description: "Robotic systems for advanced manufacturing applications",
      icon: "factory",
      image: `/src/images/focus-areas/manufacturing.jpg`,
      imageAlt: "Manufacturing Robotics research visualization",
      slug: "manufacturing"
    },
    {
      title: "Motion Planning",
      description: "Algorithms for robot movement and trajectory optimization",
      icon: "route",
      image: `/src/images/focus-areas/motion-planning.jpg`,
      imageAlt: "Motion Planning research visualization",
      slug: "motion-planning"
    },
    {
      title: "Rehabilitation Robotics",
      description: "Robotic systems for physical therapy and rehabilitation",
      icon: "heart-pulse",
      image: `/src/images/focus-areas/rehabilitation.jpg`,
      imageAlt: "Rehabilitation Robotics research visualization",
      slug: "rehabilitation"
    },
    {
      title: "Perception & Manipulation",
      description: "Robot sensing, object recognition, and grasping",
      icon: "eye-hand",
      image: `/src/images/focus-areas/perception-manipulation.jpg`,
      imageAlt: "Perception & Manipulation research visualization",
      slug: "perception-manipulation"
    },
    {
      title: "Teams & Swarms",
      description: "Multi-robot coordination and swarm robotics",
      icon: "users-group",
      image: `/src/images/focus-areas/teams-swarms.jpg`,
      imageAlt: "Teams & Swarms research visualization",
      slug: "teams-swarms"
    },
    {
      title: "SLAM",
      description: "Simultaneous Localization and Mapping for robot navigation",
      icon: "map-pin",
      image: `/src/images/focus-areas/slam.jpg`,
      imageAlt: "SLAM research visualization",
      slug: "slam"
    },
    {
      title: "Safe Autonomy",
      description: "Ensuring safety in autonomous robotic systems",
      icon: "shield-check",
      image: `/src/images/focus-areas/safe-autonomy.jpg`,
      imageAlt: "Safe Autonomy research visualization",
      slug: "safe-autonomy"
    }
  ];