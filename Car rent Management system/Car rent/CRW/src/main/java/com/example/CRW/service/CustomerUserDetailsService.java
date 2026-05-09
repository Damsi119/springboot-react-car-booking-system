package com.example.CRW.service;


import com.example.CRW.exception.OurException;
import com.example.CRW.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service

public class CustomerUserDetailsService implements UserDetailsService {

    @Autowired

    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userame) throws UsernameNotFoundException {
        return userRepository.findByEmail(userame).orElseThrow(() -> new OurException("Username/Email not found"));
    }
}
