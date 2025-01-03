// focusAreas.ts
import artificialIntelligenceImg from '../../../images/focus-areas/artificial-intelligence.jpg';
import autonomousVehiclesImg from '../../../images/focus-areas/autonomous-vehicles.jpg';
import deepLearningImg from '../../../images/focus-areas/deep-learning.jpg';
import humanRobotImg from '../../../images/focus-areas/human-robot.jpg';
import leggedRobotsImg from '../../../images/focus-areas/legged-robots.jpg';
import manufacturingImg from '../../../images/focus-areas/manufacturing.jpg';
import motionPlanningImg from '../../../images/focus-areas/motion-planning.jpg';
import rehabilitationImg from '../../../images/focus-areas/rehabilitation.jpg';
import perceptionManipulationImg from '../../../images/focus-areas/perception-manipulation.jpg';
import teamsSwarmsImg from '../../../images/focus-areas/teams-swarms.jpg';
import slamImg from '../../../images/focus-areas/slam.jpg';
import safeAutonomyImg from '../../../images/focus-areas/safe-autonomy.jpg';

export interface FocusArea {
    title: string;
    description: string;
    icon: string;
    image: ImageMetadata;
    imageAlt: string;
    slug: string;
}

export const focusAreas: FocusArea[] = [
    {
      title: "Artificial Intelligence",
      description: "Advanced AI systems for robotic decision making and control",
      icon: "brain",
      image: artificialIntelligenceImg,
      imageAlt: "Artificial Intelligence research visualization",
      slug: "artificial-intelligence"
    },
    {
      title: "Autonomous & Connected Vehicles", 
      description: "Research on self-driving vehicles and connected transportation systems",
      icon: "car",
      image: autonomousVehiclesImg,
      imageAlt: "Autonomous & Connected Vehicles research visualization",
      slug: "autonomous-vehicles"
    },
    {
      title: "Deep Learning for Robotics",
      description: "Neural networks and deep learning applications in robotics",
      icon: "network", 
      image: deepLearningImg,
      imageAlt: "Deep Learning for Robotics research visualization",
      slug: "deep-learning"
    },
    {
      title: "Human-Robot Interaction",
      description: "Studying and improving how humans and robots work together",
      icon: "users",
      image: humanRobotImg,
      imageAlt: "Human-Robot Interaction research visualization",
      slug: "human-robot-interaction"
    },
    {
      title: "Legged Robots & Exoskeletons",
      description: "Development of walking robots and wearable robotic systems",
      icon: "robot",
      image: leggedRobotsImg,
      imageAlt: "Legged Robots & Exoskeletons research visualization",
      slug: "legged-robots"
    },
    {
      title: "Manufacturing Robotics",
      description: "Robotic systems for advanced manufacturing applications",
      icon: "factory",
      image: manufacturingImg,
      imageAlt: "Manufacturing Robotics research visualization",
      slug: "manufacturing"
    },
    {
      title: "Motion Planning",
      description: "Algorithms for robot movement and trajectory optimization",
      icon: "route",
      image: motionPlanningImg,
      imageAlt: "Motion Planning research visualization",
      slug: "motion-planning"
    },
    {
      title: "Rehabilitation Robotics",
      description: "Robotic systems for physical therapy and rehabilitation",
      icon: "heart-pulse",
      image: rehabilitationImg,
      imageAlt: "Rehabilitation Robotics research visualization",
      slug: "rehabilitation"
    },
    {
      title: "Perception & Manipulation",
      description: "Robot sensing, object recognition, and grasping",
      icon: "eye-hand",
      image: perceptionManipulationImg,
      imageAlt: "Perception & Manipulation research visualization",
      slug: "perception-manipulation"
    },
    {
      title: "Teams & Swarms",
      description: "Multi-robot coordination and swarm robotics",
      icon: "users-group",
      image: teamsSwarmsImg,
      imageAlt: "Teams & Swarms research visualization",
      slug: "teams-swarms"
    },
    {
      title: "SLAM",
      description: "Simultaneous Localization and Mapping for robot navigation",
      icon: "map-pin",
      image: slamImg,
      imageAlt: "SLAM research visualization",
      slug: "slam"
    },
    {
      title: "Safe Autonomy",
      description: "Ensuring safety in autonomous robotic systems",
      icon: "shield-check",
      image: safeAutonomyImg,
      imageAlt: "Safe Autonomy research visualization",
      slug: "safe-autonomy"
    }
];