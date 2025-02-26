-- MySQL dump 10.13  Distrib 8.4.4, for macos14.7 (x86_64)
--
-- Host: 84.54.44.107    Database: db_rpk
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_ban`
--

DROP TABLE IF EXISTS `auth_ban`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_ban` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip` varchar(256) NOT NULL,
  `date_finish` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_ban`
--

LOCK TABLES `auth_ban` WRITE;
/*!40000 ALTER TABLE `auth_ban` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_ban` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_wrong_attempts`
--

DROP TABLE IF EXISTS `auth_wrong_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_wrong_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip` varchar(256) NOT NULL,
  `date_attempt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ip` (`ip`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_wrong_attempts`
--

LOCK TABLES `auth_wrong_attempts` WRITE;
/*!40000 ALTER TABLE `auth_wrong_attempts` DISABLE KEYS */;
INSERT INTO `auth_wrong_attempts` VALUES (15,'::1','2025-01-27 08:42:58');
/*!40000 ALTER TABLE `auth_wrong_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material`
--

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `prop_p` decimal(20,5) NOT NULL DEFAULT '0.00000',
  `prop_c` decimal(20,5) NOT NULL DEFAULT '0.00000',
  `prop_t0` decimal(20,5) NOT NULL DEFAULT '0.00000',
  `prop_m0` decimal(20,5) NOT NULL DEFAULT '0.00000',
  `prop_b` decimal(20,5) NOT NULL DEFAULT '0.00000',
  `prop_tr` decimal(20,5) NOT NULL DEFAULT '0.00000',
  `prop_n` decimal(20,5) NOT NULL DEFAULT '0.00000',
  `prop_au` decimal(20,5) NOT NULL DEFAULT '0.00000',
  `date_create` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material`
--

LOCK TABLES `material` WRITE;
/*!40000 ALTER TABLE `material` DISABLE KEYS */;
INSERT INTO `material` VALUES (7,'Полиметилметакрилат',1180.00000,1450.00000,160.00000,26200.00000,0.04000,180.00000,0.40000,650.00000,'2025-01-24 15:49:54'),(8,'Полиэтилен высокой плотности',950.00000,2250.00000,120.00000,29940.00000,0.00700,190.00000,0.35000,400.00000,'2025-01-24 15:54:01'),(10,'Тест тест 123',6756.00000,1000.00000,1000.00000,1.00000,2.00000,10.00000,4.00000,5.00000,'2025-01-24 19:36:23');
/*!40000 ALTER TABLE `material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting`
--

DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setting` (
  `name` varchar(32) NOT NULL,
  `value` varchar(64) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES ('auth_ban_mins','5'),('auth_count_attempts','3');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` enum('admin','user') NOT NULL,
  `login` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `date_create` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','admin','admin','2025-01-01 10:00:00'),(2,'user','technolog','technolog','2025-01-01 11:00:00');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-27 15:01:07
