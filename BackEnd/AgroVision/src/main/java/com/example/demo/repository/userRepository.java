package com.example.demo.repository;

import com.example.demo.model.userModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface userRepository extends JpaRepository<userModel,Long>
{
	// find user by email
	Optional<userModel> findByEmail(String email);
}