package com.duocuc.taskmanager.repository;

import com.duocuc.taskmanager.model.Task;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void shouldSaveAndRetrieveTask() {
        Task task = new Task("Configurar pipeline", "Automatizar build y deploy con GitHub Actions");
        Task saved = taskRepository.save(task);

        assertThat(saved.getId()).isNotNull();
        assertThat(taskRepository.findById(saved.getId())).isPresent();
        assertThat(taskRepository.findById(saved.getId()).get().getTitle())
                .isEqualTo("Configurar pipeline");
    }

    @Test
    void shouldDeleteTask() {
        Task task = taskRepository.save(new Task("Tarea temporal", "desc"));
        Long id = task.getId();

        taskRepository.deleteById(id);

        assertThat(taskRepository.findById(id)).isEmpty();
    }
}
