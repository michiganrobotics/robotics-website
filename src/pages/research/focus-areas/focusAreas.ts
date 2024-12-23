// focusAreas.ts
export interface FocusArea {
    title: string;
    description: string;
    icon: string;
    image: string;
    slug: string;
  }
  
  export const focusAreas: FocusArea[] = [
    {
      title: "Artificial Intelligence",
      description: "Advanced AI systems for robotic decision making and control",
      icon: "brain",
      image: "/public/artificial-intelligence.jpg",
      imageAlt: "",
      slug: "artificial-intelligence"
    },
    {
      title: "Autonomous & Connected Vehicles",
      description: "Research on self-driving vehicles and connected transportation systems",
      icon: "car",
      image: "/public/autonomous-vehicles.jpg",
      imageAlt: "",
      slug: "autonomous-vehicles"
    },
    {
      title: "Deep Learning for Robotics",
      description: "Neural networks and deep learning applications in robotics",
      icon: "network",
      image: "/public/deep-learning.jpg",
      imageAlt: "",
      slug: "deep-learning"
    },
    {
      title: "Human-Robot Interaction",
      description: "Studying and improving how humans and robots work together",
      icon: "users",
      image: "/public/human-robot.jpg",
      imageAlt: "",
      slug: "human-robot-interaction"
    },
    {
      title: "Legged Robots & Exoskeletons",
      description: "Development of walking robots and wearable robotic systems",
      icon: "robot",
      image: "/public/legged-robots.jpg",
      imageAlt: "",
      slug: "legged-robots"
    },
    {
      title: "Manufacturing Robotics",
      description: "Robotic systems for advanced manufacturing applications",
      icon: "factory",
      image: "/public/manufacturing.jpg",
      imageAlt: "",
      slug: "manufacturing"
    },
    {
      title: "Motion Planning",
      description: "Algorithms for robot movement and trajectory optimization",
      icon: "route",
      image: "/public/motion-planning.jpg",
      imageAlt: "",
      slug: "motion-planning"
    },
    {
      title: "Rehabilitation Robotics",
      description: "Robotic systems for physical therapy and rehabilitation",
      icon: "heart-pulse",
      image: "/public/rehabilitation.jpg",
      imageAlt: "",
      slug: "rehabilitation"
    },
    {
      title: "Perception & Manipulation",
      description: "Robot sensing, object recognition, and grasping",
      icon: "eye-hand",
      image: "/public/perception-manipulation.jpg",
      imageAlt: "",
      slug: "perception-manipulation"
    },
    {
      title: "Teams & Swarms",
      description: "Multi-robot coordination and swarm robotics",
      icon: "users-group",
      image: "/public/teams-swarms.jpg",
      imageAlt: "",
      slug: "teams-swarms"
    },
    {
      title: "SLAM",
      description: "Simultaneous Localization and Mapping for robot navigation",
      icon: "map-pin",
      image: "/public/slam.jpg",
      imageAlt: "",
      slug: "slam"
    },
    {
      title: "Safe Autonomy",
      description: "Ensuring safety in autonomous robotic systems",
      icon: "shield-check",
      image: "/public/safe-autonomy.jpg",
      imageAlt: "",
      slug: "safe-autonomy"
    }
  ];
  