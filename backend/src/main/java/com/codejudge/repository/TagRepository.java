package com.codejudge.repository;

import com.codejudge.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {
    Optional<Tag> findBySlug(String slug);
    List<Tag> findBySlugIn(Collection<String> slugs);
}

